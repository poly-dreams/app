package main

import (
	"fmt"
	"net/http"
	"regexp"
)

func homeHandler(w http.ResponseWriter, r *http.Request) {
	svgRegex := regexp.MustCompile(`^.*\.svg$`)
	if svgRegex.MatchString(r.URL.Path) {
		fmt.Println(r.URL.Path)
		http.ServeFile(w, r, "./static_images"+r.URL.Path)
	}
	http.ServeFile(w, r, "index.html")

}

func mainScritpt(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/javascript")
	http.ServeFile(w, r, "./static/main.js")
}

func serveScript(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/javascript")
	http.ServeFile(w, r, "./static/script.js")
}

func serveRadialmenu(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "./static/radialMenu.html")
}

// serve styles
func serveStyles(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/css")
	http.ServeFile(w, r, "./static/style.css")
}
func serveStyle_leaflet(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/css")
	http.ServeFile(w, r, "./static/style_leaflet.css")
}

func main() {

	http.HandleFunc("/", homeHandler)
	http.HandleFunc("/main.js", mainScritpt)
	http.HandleFunc("/script.js", serveScript)
	http.HandleFunc("/radialMenu.html", serveRadialmenu)
	http.HandleFunc("/style.css", serveStyles)
	http.HandleFunc("/style_leaflet.css", serveStyle_leaflet)
	fmt.Println("Server is listening on port 8080")
	http.ListenAndServe(":8177", nil)
}
