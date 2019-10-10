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
	Account string
}

type ImportForm struct {
	Account string
	Client string
	Lcd string
	Path string
	Payload string
}

type txTemplateParams struct {
	Account string
	Client string
	Lcd string
	Path string
	Payload string
	ShuffledNumCode template.HTML
	ShuffledAlphabetCode template.HTML
}