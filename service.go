package main

import (
	"github.com/gorilla/mux"
	"google.golang.org/appengine"
	"google.golang.org/appengine/log"
	"html/template"
	"net/http"
	"net/url"
	"strings"
)

func indexHandler(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		http.Redirect(w, r, "/", http.StatusFound)
		return
	}

	indexTemplate.Execute(w, nil)
	return
}

func importHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)

	ctx := appengine.NewContext(r)
	client, err := url.QueryUnescape(vars["client"])
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

	log.Infof(ctx, "client: %v", client)
	log.Infof(ctx, "path: %v", path)
	log.Infof(ctx, "payload: %v", payload)

	params := importTemplateParams{}
	params.QueryUrl = "signin?client=" + url.QueryEscape(client) + "&path=" + url.QueryEscape(path) + "&payload=" + url.QueryEscape(payload)
	params.Client = client
	params.Path = path
	params.Payload = payload
	params.ShuffledNumCode = template.HTML(GetShuffledNum())			// Keypad of shuffled number
	params.ShuffledAlphabetCode = template.HTML(GetShuffledAlphabet())	// Keypad of shuffled alphabet

	importTemplate.Execute(w, params)
	return
}

func signInHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)

	ctx := appengine.NewContext(r)
	client, err := url.QueryUnescape(vars["client"])
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

	log.Infof(ctx, "client: %v", client)
	log.Infof(ctx, "path: %v", path)
	log.Infof(ctx, "payload: %v", payload)

	params := signInTemplateParams{}
	params.QueryUrl = "import?client=" + url.QueryEscape(client) + "&path=" + url.QueryEscape(path) + "&payload=" + url.QueryEscape(payload)
	params.ShuffledNumCode = template.HTML(GetShuffledNum())			// Keypad of shuffled number
	params.ShuffledAlphabetCode = template.HTML(GetShuffledAlphabet())	// Keypad of shuffled alphabet

	signInTemplate.Execute(w, params)
	return
}

func sessionInHandler(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)

	// HTML 폼 전송 처리
	importForm := ImportForm{
		Client: r.FormValue("client"),
		Path: r.FormValue("path"),
		Payload: r.FormValue("payload"),
	}

	client, err := url.QueryUnescape(importForm.Client)
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

	log.Infof(ctx, "client: %v", client)
	log.Infof(ctx, "path: %v", path)
	log.Infof(ctx, "payload: %v", payload)

	payloadForQuery := ""
	if payload != "cosmos" && payload != "iris" {
		if strings.Index(payload, "cosmos") == 0 {
			payloadForQuery = "cosmos"
		} else if strings.Index(payload, "iaa") == 0 {
			payloadForQuery = "iris"
		}
	}

	params := sessionTemplateParams{}
	params.QueryUrl = "import?client=" + url.QueryEscape(client) + "&path=" + url.QueryEscape(path) + "&payload=" + url.QueryEscape(payloadForQuery)
	params.Payload = payload	// address

	sessionTemplate.Execute(w, params)
	return
}

func txHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)

	ctx := appengine.NewContext(r)
	client, err := url.QueryUnescape(vars["client"])
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

	log.Infof(ctx, "client: %v", client)
	log.Infof(ctx, "path: %v", path)
	log.Infof(ctx, "payload: %v", payload)

	params := txTemplateParams{}
	params.Client = client
	params.Path = path
	params.Payload = payload
	params.ShuffledNumCode = template.HTML(GetShuffledNum())			// Keypad of shuffled number
	params.ShuffledAlphabetCode = template.HTML(GetShuffledAlphabet())	// Keypad of shuffled alphabet

	txTemplate.Execute(w, params)
	return
}