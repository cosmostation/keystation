package main

import "html/template"

type signInTemplateParams struct {
	QueryUrl string
	Payload string
	ShuffledNumCode template.HTML
	ShuffledAlphabetCode template.HTML
}

type importTemplateParams struct {
	QueryUrl string
	Client string
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
	Path string
	Payload string
}

type txTemplateParams struct {
	Client string
	Path string
	Payload string
}