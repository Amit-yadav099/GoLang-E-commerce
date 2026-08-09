package controllers

import (
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/razorpay/razorpay-go"
	rzputils "github.com/razorpay/razorpay-go/utils"
)

type createPaymentOrderRequest struct {
	Amount float64 `json:"amount"`
}

type verifyPaymentRequest struct {
	RazorpayOrderID   string `json:"razorpay_order_id"`
	RazorpayPaymentID string `json:"razorpay_payment_id"`
	RazorpaySignature string `json:"razorpay_signature"`
}

func getRazorpayClient() (*razorpay.Client, string, error) {
	keyID := os.Getenv("RAZORPAY_KEY_ID")
	keySecret := os.Getenv("RAZORPAY_KEY_SECRET")
	if keyID == "" || keySecret == "" {
		return nil, "", fmt.Errorf("razorpay credentials not configured")
	}
	return razorpay.NewClient(keyID, keySecret), keyID, nil
}

func CreatePaymentOrder(c *gin.Context) {
	var req createPaymentOrderRequest
	if err := c.ShouldBindJSON(&req); err != nil || req.Amount <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Valid amount is required"})
		return
	}

	client, keyID, err := getRazorpayClient()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Payment gateway not configured"})
		return
	}

	amountPaise := int(req.Amount * 100)
	if amountPaise < 100 {
		amountPaise = 100
	}

	data := map[string]interface{}{
		"amount":   amountPaise,
		"currency": "INR",
		"receipt":  fmt.Sprintf("rcpt_%d", time.Now().UnixNano()),
	}

	order, err := client.Order.Create(data, nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to create payment order", "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"id":       order["id"],
		"amount":   order["amount"],
		"currency": order["currency"],
		"keyId":    keyID,
	})
}

func VerifyPayment(c *gin.Context) {
	var req verifyPaymentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid payment verification payload"})
		return
	}

	if req.RazorpayOrderID == "" || req.RazorpayPaymentID == "" || req.RazorpaySignature == "" {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Missing payment verification fields"})
		return
	}

	keySecret := os.Getenv("RAZORPAY_KEY_SECRET")
	if keySecret == "" {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Payment gateway not configured"})
		return
	}

	params := map[string]interface{}{
		"razorpay_order_id":   req.RazorpayOrderID,
		"razorpay_payment_id": req.RazorpayPaymentID,
	}

	if !rzputils.VerifyPaymentSignature(params, req.RazorpaySignature, keySecret) {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Payment verification failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":   "Payment verified successfully",
		"paymentId": req.RazorpayPaymentID,
	})
}
