package service

import (
	"github.com/gorilla/mux"
	"html/template"
	"net/http"
	"net/url"
	"strings"
	"keystation/model"
	"keystation/util"
)

var (
	indexTemplate = template.Must(template.ParseFiles("www/index.html"))
	importTemplate = template.Must(template.ParseFiles("www/import.html"))
	signInTemplate = template.Must(template.ParseFiles("www/signin.html"))
	sessionTemplate = template.Must(template.ParseFiles("www/session.html"))
	txTemplate = template.Must(template.ParseFiles("www/transaction.html"))
)

func IndexHandler(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		http.Redirect(w, r, "/", http.StatusFound)
		return
	}

	indexTemplate.Execute(w, nil)
	return
}

func ImportHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)

	client, err := url.QueryUnescape(vars["client"])
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	lcd, err := url.QueryUnescape(vars["lcd"])
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	path, err := url.QueryUnescape(vars["path"])
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	payload, err := url.QueryUnescape(vars["payload"])
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	option := ""
	if vars["option"] != "" {
		option, err = url.QueryUnescape(vars["option"])
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}

	params := model.ImportTemplateParams{}
	params.QueryUrl = "signin?client=" + url.QueryEscape(client) + "&lcd=" + url.QueryEscape(lcd) + "&path=" + url.QueryEscape(path) + "&payload=" + url.QueryEscape(payload)
	params.Client = client
	params.Lcd = lcd
	params.Path = path
	params.Payload = payload
	if option == "disablechecksum" {
		params.Option = option
	}
	params.ShuffledNumCode = template.HTML(util.GetShuffledNum())			// Keypad of shuffled number
	params.ShuffledAlphabetCode = template.HTML(util.GetShuffledAlphabet())	// Keypad of shuffled alphabet

	importTemplate.Execute(w, params)
	return
}

func SignInHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)

	client, err := url.QueryUnescape(vars["client"])
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	lcd, err := url.QueryUnescape(vars["lcd"])
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	path, err := url.QueryUnescape(vars["path"])
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	payload, err := url.QueryUnescape(vars["payload"])
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	params := model.SignInTemplateParams{}
	params.QueryUrl = "import?client=" + url.QueryEscape(client) + "&lcd=" + url.QueryEscape(lcd) + "&path=" + url.QueryEscape(path) + "&payload=" + url.QueryEscape(payload) + "&option="
	params.Lcd = lcd
	params.ShuffledNumCode = template.HTML(util.GetShuffledNum())			// Keypad of shuffled number
	params.ShuffledAlphabetCode = template.HTML(util.GetShuffledAlphabet())	// Keypad of shuffled alphabet

	signInTemplate.Execute(w, params)
	return
}

func SessionInHandler(w http.ResponseWriter, r *http.Request) {
	// HTML Form
	importForm := model.ImportForm{
		Account: r.FormValue("account"),
		Client: r.FormValue("client"),
		Path: r.FormValue("path"),
		Payload: r.FormValue("payload"),
	}

	account, err := url.QueryUnescape(importForm.Account)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	client, err := url.QueryUnescape(importForm.Client)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	lcd, err := url.QueryUnescape(importForm.Lcd)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	path, err := url.QueryUnescape(importForm.Path)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	payload, err := url.QueryUnescape(importForm.Payload)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	payloadForQuery := ""
	if payload != "cosmos" && payload != "iris" {
		if strings.Index(payload, "cosmos") == 0 {
			payloadForQuery = "cosmos"
		} else if strings.Index(payload, "iaa") == 0 {
			payloadForQuery = "iris"
		}
	}

	params := model.SessionTemplateParams{}
	params.QueryUrl = "import?client=" + url.QueryEscape(client) + "&lcd=" + url.QueryEscape(lcd) + "&path=" + url.QueryEscape(path) + "&payload=" + url.QueryEscape(payloadForQuery) + "&option="
	params.Payload = payload	// address
	params.Account = account	// keychain account

	sessionTemplate.Execute(w, params)
	return
}

func TxHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)

	account, err := url.QueryUnescape(vars["account"])
	
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	client, err := url.QueryUnescape(vars["client"])
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	lcd, err := url.QueryUnescape(vars["lcd"])
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	path, err := url.QueryUnescape(vars["path"])
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	payload, err := url.QueryUnescape(vars["payload"])
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	params := model.TxTemplateParams{}
	params.Account = account
	params.Client = client
	params.Lcd = lcd
	params.Path = path
	params.Payload = payload
	params.ShuffledNumCode = template.HTML(util.GetShuffledNum())			// Keypad of shuffled number
	params.ShuffledAlphabetCode = template.HTML(util.GetShuffledAlphabet())	// Keypad of shuffled alphabet

	txTemplate.Execute(w, params)
	return
}