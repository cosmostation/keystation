package main

import "html/template"

type signInTemplateParams struct {
	QueryUrl string
	ShuffledNumCode template.HTML
	ShuffledAlphabetCode template.HTML
}

type importTemplateParams struct {
	QueryUrl string
	ShuffledNumCode template.HTML
	ShuffledAlphabetCode template.HTML
	Client string
	Payload string
}

type sessionTemplateParams struct {
	QueryUrl string
	Payload string
}

type ImportForm struct {
	Client string
	Payload string
}
