package main

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"math/rand"
	"strings"
	"regexp"
	"time"
)

type Shufflable interface {
	Len() int
	Swap(i, j int)
}

func Shuffle(s Shufflable) {
	r := rand.New(rand.NewSource(time.Now().Unix()))
	for n := s.Len(); n > 0; n-- {
		s.Swap(r.Intn(n), n-1)
	}
}

func checkMAC(message string, messageMAC string, secret string) bool {
	equalFlag := false
	sha := hashMAC(message, secret)
	if messageMAC == sha {
		equalFlag = true
	}
	return equalFlag
}

func hashMAC(message string, secret string) string {
	h := hmac.New(sha256.New, []byte(secret))
	h.Write([]byte(message))
	sha := hex.EncodeToString(h.Sum(nil))
	return sha
}

func srand(size int) string {
	var alpha = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789"
	buf := make([]byte, size)
	for i := 0; i < size; i++ {
		buf[i] = alpha[rand.Intn(len(alpha))]
	}
	return string(buf)
}

func validateAccountName(name string) bool {
	// 계정 이름이 빈칸
	if name == "" {
		return false
	}

	// 계정 이름에 . 이 있는가?
	if strings.Contains(name, ".") {
		return false
	}

	// 계정이 12자리가 맞는가?
	if len(name) != 12 {
		return false
	}

	// a-z 소문자, 1-5 숫자만 있는가?
	re := regexp.MustCompile("[^a-z1-5]")

	return !re.MatchString(name)
}