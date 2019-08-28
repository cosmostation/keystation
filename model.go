package main

import "html/template"

type signInTemplateParams struct {
	QueryUrl string
	Lcd string
	Payload string
	ShuffledNumCode template.HTML
	ShuffledAlphabetCode template.HTML
}

type importTemplateParams struct {
	QueryUrl string
	Client string
	Lcd string
	Path string
	Payload string
	ShuffledNumCode template.HTML
	ShuffledAlphabetCode template.HTML
}

type sessionTemplateParams struct {
	QueryUrl string
	Payload string
}

type ImportForm struct {
	Client string
	Lcd string
	Path string
	Payload string
}

type txTemplateParams struct {
	Client string
	Lcd string
	Path string
	Payload string
	ShuffledNumCode template.HTML
	ShuffledAlphabetCode template.HTML
}