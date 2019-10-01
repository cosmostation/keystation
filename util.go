package main

import (
	"math/rand"
	"sort"
	"strconv"
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

func GetShuffledNum() string {
	numSlice := []int{0, 1, 2, 3, 4, 5, 6, 7, 8, 9}
	Shuffle(sort.IntSlice(numSlice))

	// Make these codes
	//<div class="finger grid-number">1</div>
	//<div class="finger grid-number">2</div>
	//...
	//<div class="finger grid-number">9</div>
	//<div class="grid-number"></div>
	//<div class="finger grid-number">0</div>
	//<div class="finger grid-number">←</div>

	shuffledNumCode := ""
	for i := 0; i < 10; i++ {
		shuffledNumCode += `<div class="finger grid-number">` + strconv.Itoa(numSlice[i]) + `</div>`
		if i == 8 {
			shuffledNumCode += `<div class="grid-number"></div>`
		} else if i == 9 {
			shuffledNumCode += `<div class="finger grid-number">←</div>`
		}
	}
	return shuffledNumCode
}

func GetShuffledAlphabet() string {
	alphabetSlice := []string{"A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"}
	Shuffle(sort.StringSlice(alphabetSlice))

	// Make these codes
	//<div class="finger grid-number">A</div>
	//<div class="finger grid-number">B</div>
	//...
	//<div class="finger grid-number">Z</div>
	//<div class="grid-number"></div>
	//<div class="finger grid-number">←</div>

	shuffledAlphabetCode := ""
	for i := 0; i < 26; i++ {
		shuffledAlphabetCode += `<div class="finger grid-number">` + alphabetSlice[i] + `</div>`
		if i == 25 {
			shuffledAlphabetCode += `<div class="grid-number"></div>`
			shuffledAlphabetCode += `<div class="finger grid-number">←</div>`
		}
	}
	return shuffledAlphabetCode
}