package main

import (
	"fmt"
	"log"
	"net/http"
	"github.com/gorilla/mux"
	"os"
	"keystation/service"
)

func main() {
	r := mux.NewRouter()

	r.Path("/").HandlerFunc(service.IndexHandler)
	r.Path("/import").
		Queries("client", "{client}").
		Queries("lcd", "{lcd}").
		Queries("path", "{path}").
		Queries("payload", "{payload}").
		HandlerFunc(service.ImportHandler).
		Methods("GET")
	r.Path("/signin").
		Queries("client", "{client}").
		Queries("lcd", "{lcd}").
		Queries("path", "{path}").
		Queries("payload", "{payload}").
		HandlerFunc(service.SignInHandler).
		Methods("GET")
	r.Path("/session").
		Queries("account", "{account}").
		Queries("client", "{client}").
		Queries("lcd", "{lcd}").
		Queries("path", "{path}").
		Queries("payload", "{payload}").
		HandlerFunc(service.SessionInHandler).
		Methods("GET")
	r.Path("/tx").
		Queries("account", "{account}").
		Queries("client", "{client}").
		Queries("lcd", "{lcd}").
		Queries("path", "{path}").
		Queries("payload", "{payload}").
		HandlerFunc(service.TxHandler).
		Methods("GET")

	// The path "/" matches everything not matched by some other path.
	http.Handle("/", r)

	favicon := http.StripPrefix("/favicon.ico", http.FileServer(http.Dir("www/img/favicon.ico")))
	http.Handle("/favicon.ico", favicon)
	lib := http.StripPrefix("/lib", http.FileServer(http.Dir("www/lib")))
	http.Handle("/lib/", lib)
	js := http.StripPrefix("/js", http.FileServer(http.Dir("www/js")))
	http.Handle("/js/", js)
	css := http.StripPrefix("/css", http.FileServer(http.Dir("www/css")))
	http.Handle("/css/", css)
	img := http.StripPrefix("/img", http.FileServer(http.Dir("www/img")))
	http.Handle("/img/", img)
	fonts := http.StripPrefix("/fonts", http.FileServer(http.Dir("www/fonts")))
	http.Handle("/fonts/", fonts)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
		log.Printf("Defaulting to port %s", port)
	}

	log.Printf("Listening on port %s", port)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%s", port), nil))
}