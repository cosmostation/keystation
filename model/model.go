package model

import "html/template"

type SignInTemplateParams struct {
	QueryUrl string
	Lcd string
	Payload string
	ShuffledNumCode template.HTML
	ShuffledAlphabetCode template.HTML

	Client string
	Path string
}

type ImportTemplateParams struct {
	QueryUrl string
	Client string
	Lcd string
	Path string
	Payload string
	Option string
	ShuffledNumCode template.HTML
	ShuffledAlphabetCode template.HTML
}

type SessionTemplateParams struct {
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

type TxTemplateParams struct {
	Account string
	Client string
	Lcd string
	Path string
	Payload string
	ShuffledNumCode template.HTML
	ShuffledAlphabetCode template.HTML
}

type SettingTemplateParams struct {
	Account string
	Client string
	Lcd string
	Path string
	Payload string
	ShuffledNumCode template.HTML
	ShuffledAlphabetCode template.HTML
	CloseQueryUrl string
}