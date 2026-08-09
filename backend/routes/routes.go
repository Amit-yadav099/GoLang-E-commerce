package routes

import (
	"shopease-backend/controllers"
	"shopease-backend/middleware"

	"github.com/gin-gonic/gin"
)

func RegisterAuthRoutes(rg *gin.RouterGroup) {
	auth := rg.Group("/auth")
	{
		auth.POST("/register", controllers.RegisterUser)
		auth.POST("/login", controllers.LoginUser)
		auth.POST("/verify-email", controllers.VerifyEmail)
		auth.GET("/user", middleware.Protect(), middleware.Admin(), controllers.GetUsers)
	}
}

func RegisterProductRoutes(rg *gin.RouterGroup) {
	products := rg.Group("/products")
	{
		products.GET("", controllers.GetProducts)
		products.POST("", middleware.Protect(), middleware.Admin(), controllers.CreateProduct)
		products.GET("/:id", controllers.GetProductByID)
		products.PUT("/:id", middleware.Protect(), middleware.Admin(), controllers.UpdateProduct)
		products.DELETE("/:id", middleware.Protect(), middleware.Admin(), controllers.DeleteProduct)
	}
}

func RegisterOrderRoutes(rg *gin.RouterGroup) {
	orders := rg.Group("/orders")
	{
		orders.POST("", middleware.Protect(), controllers.CreateOrder)
		orders.GET("", middleware.Protect(), middleware.Admin(), controllers.GetOrders)
		orders.GET("/myOrders", middleware.Protect(), controllers.MyOrders)
		orders.GET("/myorders", middleware.Protect(), controllers.MyOrders)
		orders.PUT("/:id/status", middleware.Protect(), middleware.Admin(), controllers.UpdateOrderStatus)
	}
}

func RegisterAnalyticsRoutes(rg *gin.RouterGroup) {
	analytics := rg.Group("/analytics")
	{
		analytics.GET("", middleware.Protect(), middleware.Admin(), controllers.GetAdminStats)
	}
}

func RegisterPaymentRoutes(rg *gin.RouterGroup) {
	payment := rg.Group("/payment")
	{
		payment.POST("/order", controllers.CreatePaymentOrder)
		payment.POST("/verify", controllers.VerifyPayment)
	}
}
