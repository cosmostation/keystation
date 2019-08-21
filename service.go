package main

import (
	"fmt"
	"github.com/gorilla/mux"
	"google.golang.org/appengine"
	"google.golang.org/appengine/log"
	"net/http"
	"net/url"
	"sort"
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
	// grid-number 셔플해서 클라이언트에 보내야함

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

	// PIN 키패드 셔플
	//<div class="finger grid-number">1</div>
	//<div class="finger grid-number">2</div>
	//<div class="finger grid-number">3</div>
	//<div class="finger grid-number">4</div>
	//<div class="finger grid-number">5</div>
	//<div class="finger grid-number">6</div>
	//<div class="finger grid-number">7</div>
	//<div class="finger grid-number">8</div>
	//<div class="finger grid-number">9</div>
	//<div class="grid-number"></div>
	//<div class="finger grid-number">0</div>
	//<div class="finger grid-number">←</div>

	slice := []int{0, 1, 2, 3, 4, 5, 6, 7, 8, 9}
	strSlice := []string{"a", "b", "c", "d"}
	Shuffle(sort.IntSlice(slice))
	Shuffle(sort.StringSlice(strSlice))
	//fmt.Println(slice)
	//fmt.Println(strSlice)

	//log.Infof(ctx, `<div class="finger grid-number">%v</div>`, numArr[i])

	//for i := 0; i < 10; i++ {
	//}




	params := signInTemplateParams{}
	params.QueryUrl = "import?client=" + url.QueryEscape(client) + "&payload=" + url.QueryEscape(payload)
	// grid-number 셔플해서 클라이언트에 보내야함

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