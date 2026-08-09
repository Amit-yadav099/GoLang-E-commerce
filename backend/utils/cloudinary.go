package utils

import (
	"context"
	"fmt"
	"mime/multipart"
	"os"
	"path/filepath"

	"shopease-backend/config"

	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
)

func UploadToCloudinary(file *multipart.FileHeader) (string, error) {
	if config.Cloudinary == nil {
		return "", fmt.Errorf("cloudinary is not configured")
	}

	tmpDir := "uploads"
	if err := os.MkdirAll(tmpDir, 0755); err != nil {
		return "", err
	}

	tmpPath := filepath.Join(tmpDir, file.Filename)
	if err := saveUploadedFile(file, tmpPath); err != nil {
		return "", err
	}
	defer os.Remove(tmpPath)

	ctx := context.Background()
	result, err := config.Cloudinary.Upload.Upload(ctx, tmpPath, uploader.UploadParams{})
	if err != nil {
		return "", err
	}

	return result.SecureURL, nil
}

func saveUploadedFile(file *multipart.FileHeader, dst string) error {
	src, err := file.Open()
	if err != nil {
		return err
	}
	defer src.Close()

	out, err := os.Create(dst)
	if err != nil {
		return err
	}
	defer out.Close()

	buf := make([]byte, 1024*32)
	for {
		n, readErr := src.Read(buf)
		if n > 0 {
			if _, writeErr := out.Write(buf[:n]); writeErr != nil {
				return writeErr
			}
		}
		if readErr != nil {
			break
		}
	}
	return nil
}
