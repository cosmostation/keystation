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
	//<div class="finger grid-number">3</div>
	//<div class="finger grid-number">4</div>
	//<div class="finger grid-number">5</div>
	//<div class="finger grid-number">6</div>
	//<div class="finger grid-number">7</div>
	//<div class="finger grid-number">8</div>
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
	//<div class="finger grid-number">C</div>
	//<div class="finger grid-number">D</div>
	//<div class="finger grid-number">E</div>
	//<div class="finger grid-number">F</div>
	//<div class="finger grid-number">G</div>
	//<div class="finger grid-number">H</div>
	//<div class="finger grid-number">I</div>
	//<div class="finger grid-number">J</div>
	//<div class="finger grid-number">K</div>
	//<div class="finger grid-number">L</div>
	//<div class="finger grid-number">M</div>
	//<div class="finger grid-number">N</div>
	//<div class="finger grid-number">O</div>
	//<div class="finger grid-number">P</div>
	//<div class="finger grid-number">Q</div>
	//<div class="finger grid-number">R</div>
	//<div class="finger grid-number">S</div>
	//<div class="finger grid-number">T</div>
	//<div class="finger grid-number">U</div>
	//<div class="finger grid-number">V</div>
	//<div class="finger grid-number">W</div>
	//<div class="finger grid-number">X</div>
	//<div class="finger grid-number">Y</div>
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