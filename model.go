package main

type signInTemplateParams struct {
	QueryUrl string
	Payload string
}

type importTemplateParams struct {
	QueryUrl string
	Client string
	Path string
	Payload string
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
