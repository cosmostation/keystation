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

	params := sessionTemplateParams{}
	params.QueryUrl = "import?client=" + url.QueryEscape(client) + "&path=" + url.QueryEscape(path) + "&payload=" + url.QueryEscape(payload)
	params.Payload = payload

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

	//body := []byte(payload)
	//var stdMsg CosmosSdkMsgSend
	//_ = json.Unmarshal(body, &stdMsg)

	//log.Infof(ctx, "stdMsg: %v", stdMsg)

	//{
	//	"account_number": "18012",
	//	"chain_id": "cosmoshub-2",
	//	"fee": {
	//	"amount": [
	//		{
	//			"amount": "5000",
	//			"denom": "uatom"
	//		}
	//],
	//	"gas": "200000"
	//	},
	//	"memo": "",
	//	"msgs": [
	//	{
	//	"type": "cosmos-sdk/MsgSend",
	//	"value": {
	//	"amount": [
	//	{
	//	"amount": "10000",
	//	"denom": "uatom"
	//	}
	//	],
	//	"from_address": "cosmos1z67fshyr48pa9a6htdz4qd0zullfk6y0fgvxv7",
	//	"to_address": "cosmos10nv3yj0jdxf02vxyc0tavf97fdvppdth6wmcn3"
	//	}
	//	}
	//	],
	//	"sequence": "6"
	//	}

	//<h3 class="send">SEND</h3>
	//<span>From</span>
	//<p>iaa180z3qagykwpr7v6htawvh7z3n5t7zw6w0zjvc2</p>
	//<span>To</span>
	//<p>iaa1wcsa554l5lx99ylu94ujlxuu6jkvacvpp63ajc</p>
	//<span>Amount</span>
	//<p><span>2,430.928540000000000000</span>IRIS</p>
	//<span>Tx Fee</span>
	//<p><span>0.071460000000000000</span>IRIS</p>
	//<span>Memo</span>
	//<p>keystation</p>

	// payload 파싱해서 위 코드 만들기
	// chain_id, fee(amount, gas), type,











	params := txTemplateParams{}
	params.Client = client
	params.Path = path
	params.Payload = payload

	txTemplate.Execute(w, params)
	return
}