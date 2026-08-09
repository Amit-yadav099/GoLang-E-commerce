package utils

import (
	"fmt"
	"log"
	"os"

	"gopkg.in/gomail.v2"
)

func SendEmail(to, subject, htmlText string) error {
	user := os.Getenv("EMAIL_USER")
	pass := os.Getenv("EMAIL_PASS")

	if user == "" || pass == "" {
		return fmt.Errorf("email credentials not configured")
	}

	m := gomail.NewMessage()
	m.SetHeader("From", user)
	m.SetHeader("To", to)
	m.SetHeader("Subject", subject)
	m.SetBody("text/html", htmlText)

	d := gomail.NewDialer("smtp.gmail.com", 587, user, pass)

	if err := d.DialAndSend(m); err != nil {
		log.Printf("Failed to send email to %s: %v", to, err)
		return err
	}

	log.Printf("Email successfully sent to %s", to)
	return nil
}
