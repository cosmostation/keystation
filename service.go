package main

import (
	"github.com/gorilla/mux"
	"google.golang.org/appengine"
	"google.golang.org/appengine/log"
	"net/http"
	"net/url"
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

	payload, err := url.QueryUnescape(vars["payload"])
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	log.Infof(ctx, "client: %v", client)
	log.Infof(ctx, "payload: %v", payload)

	params := importTemplateParams{}
	params.QueryUrl = "signin?client=" + url.QueryEscape(client) + "&payload=" + url.QueryEscape(payload)
	params.Client = client
	params.Payload = payload

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

	payload, err := url.QueryUnescape(vars["payload"])
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	log.Infof(ctx, "client: %v", client)
	log.Infof(ctx, "payload: %v", payload)

	params := signInTemplateParams{}
	params.QueryUrl = "import?client=" + url.QueryEscape(client) + "&payload=" + url.QueryEscape(payload)

	signInTemplate.Execute(w, params)
	return
}

func sessionInHandler(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)

	// HTML 폼 전송 처리
	importForm := ImportForm{
		Client: r.FormValue("client"),
		Payload: r.FormValue("payload"),
	}

	client, err := url.QueryUnescape(importForm.Client)
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
	log.Infof(ctx, "payload: %v", payload)

	params := sessionTemplateParams{}
	params.QueryUrl = "import?client=" + url.QueryEscape(client) + "&payload=" + url.QueryEscape(payload)
	params.Payload = payload

	sessionTemplate.Execute(w, params)
	return
}

func txHandler(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/tx" {
		http.Redirect(w, r, "/tx", http.StatusFound)
		return
	}

	txTemplate.Execute(w, nil)
	return
}