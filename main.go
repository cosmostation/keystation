package main

import (
	"html/template"
	"net/http"
	"github.com/gorilla/mux"
	"google.golang.org/appengine"
)

var (
	indexTemplate = template.Must(template.ParseFiles("www/index.html"))
	importTemplate = template.Must(template.ParseFiles("www/import.html"))
	signInTemplate = template.Must(template.ParseFiles("www/signin.html"))
	sessionTemplate = template.Must(template.ParseFiles("www/session.html"))
	txTemplate = template.Must(template.ParseFiles("www/transaction.html"))
)

func main() {
	r := mux.NewRouter()

	r.Path("/").HandlerFunc(indexHandler)
	r.Path("/import").
		Queries("client", "{client}").
		Queries("lcd", "{lcd}").
		Queries("path", "{path}").
		Queries("payload", "{payload}").
		HandlerFunc(importHandler).
		Methods("GET")
	r.Path("/signin").
		Queries("client", "{client}").
		Queries("lcd", "{lcd}").
		Queries("path", "{path}").
		Queries("payload", "{payload}").
		HandlerFunc(signInHandler).
		Methods("GET")
	r.Path("/session").
		Queries("client", "{client}").
		Queries("lcd", "{lcd}").
		Queries("path", "{path}").
		Queries("payload", "{payload}").
		HandlerFunc(sessionInHandler).
		Methods("GET")
	r.Path("/tx").
		Queries("client", "{client}").
		Queries("lcd", "{lcd}").
		Queries("path", "{path}").
		Queries("payload", "{payload}").
		HandlerFunc(txHandler).
		Methods("GET")

	// The path "/" matches everything not matched by some other path.
	http.Handle("/", r)
	appengine.Main()
}