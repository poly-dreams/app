
class Main
{
	constructor()
	{
		this.pathname = window.location.pathname;
        this.navItems = document.querySelectorAll("#main-nav>ul>li");
        this.menuIconStatus = true;
        this.map = L.map("map").setView([51.5016, 0], 15)
        this.cardinals = ["top", "right", "bottom", "left"];
		this.iconURL = "";
		this.fontSize = getComputedStyle(document.documentElement).fontSize;
		this.icons = [];
		this.loginSatus = false;
	}
	pageInitialLoad()
	{
		let fontLink = document.createElement("link");
		fontLink.href = "https://fonts.googleapis.com/css2?family=Nunito:wght@400;600&family=Quicksand:wght@400;600&display=swap"
        document.head.appendChild(fontLink), document.fonts.add("400 600 Nunito", "400 600 Quicksand")
	}
	menuIconInitialPosition()
	{
		let menuIcon = document.getElementById("menu-icon"),
			sideNav = document.querySelector(".side-nav"),
			sideNavWidth = sideNav.offsetWidth;
		menuIcon.style.left = `${sideNavWidth-3.5*parseFloat(getComputedStyle(document.documentElement).fontSize)}px`
	}
	handleMenuIcon()
	{
		let menuIcon = document.getElementById("menu-icon"),
			e = document.querySelector(".side-nav"),
			n = document.querySelector(".side-nav>ul"),
			i = e.offsetWidth,
			a = document.querySelector(".main-content"),
			map = document.querySelector("#map");
		menuIcon.addEventListener("click", () =>
		{
			this.menuIconStatus = !this.menuIconStatus,
            n.style.display = this.menuIconStatus ? "block" : "none", e.style.minWidth = this.menuIconStatus ? "20rem" : "3.5rem",
			a.style.width = this.menuIconStatus ? "calc(100% - 20rem)" : "calc(100% - 3.5rem)",
            menuIcon.style.left = this.menuIconStatus ? `${i-3.5*parseFloat(this.fontSize)}px` : "0", this.map.invalidateSize()
			this.menuIconStatus ? map.style.width = "calc(100% - 20rem)" : map.style.width = "calc(100% - 3.5rem)"
			this.map.invalidateSize();
		});
        menuIcon.style.display = "block"
	}
	handleRadialMenuInitalState() {

	}
    async contextMenuhandler(e){
        e.preventDefault();
        e.stopPropagation();

        try {
            while (document.querySelector(".menuWrapper")) {
                document.querySelector(".menuWrapper").remove()
            }
        } catch (error) {
            console.log(error)
        }

        const mousePosX = e.clientX;
        const mousePosY = e.clientY;
        let radialMenu = await fetch("/radialMenu.html");
        radialMenu = await radialMenu.text();
        const parsedRadialMenu = new DOMParser().parseFromString(radialMenu, "text/html").body.firstChild;
        for (let i = 0; i < parsedRadialMenu.children.length -1; i++) {
			
            parsedRadialMenu.children[i+1].style[this.cardinals[i]] = "-2rem";
			if (!this.loginSatus) {
				let img = document.createElement("img");
				img.src = this.src = "/forbidden.svg";
				parsedRadialMenu.children[i+1].appendChild(img);
				parsedRadialMenu.children[i+1].style.cursor = "not-allowed";
			}
        }
        let contextMenu = document.createElement("div");
        contextMenu.className = "menuWrapper";
        contextMenu.appendChild(parsedRadialMenu);
        contextMenu.style.position = "absolute";
        contextMenu.style.left = `${mousePosX}px`;
        contextMenu.style.top = `${mousePosY}px`;
        contextMenu.style.zIndex = "1000";
		contextMenu.addEventListener("mouseup", e => this.handleClickRelease(e));
        document.body.appendChild(contextMenu);
    }
	mapClickHandler(e)
	{

		if(this.iconURL) {
			const fNumber = parseFloat(this.fontSize)*2;
			const ratio = (this.map.getZoom()/parseFloat(this.fontSize))**2;
			console.log(ratio)
			if (ratio>.25){
				const icon = L.icon({
					iconUrl: this.iconURL,
					iconSize: [fNumber*2*ratio, fNumber*2*ratio],
					iconAnchor: [fNumber*ratio, fNumber*ratio],
					popupAnchor: [0, 0]
				})
				L.marker([e.latlng.lat, e.latlng.lng], {icon: icon}).addTo(this.map)
			} else {
				alert("zoom in to add marker")
			}
		}
		
	}
	handleClickRelease(e)
	{
		const keyCode = (e.which||e.button);
		if (keyCode === 3)
			e.currentTarget.remove()
	}
	handleZoom(e) {
		const ratio = (this.map.getZoom()/parseFloat(this.fontSize))**2;
		const fNumber = parseFloat(this.fontSize)*2;
		console.log(ratio)
		this.map.eachLayer(layer => {
			if (layer instanceof L.Marker) {
				if (ratio>.25){
					layer.setIcon(L.icon({
						iconUrl: this.iconURL,
						iconSize: [fNumber*2*ratio, fNumber*2*ratio],
						iconAnchor: [fNumber*ratio, fNumber*ratio],
						popupAnchor: [0, 0]
					}))	
				}
				else{
					layer.setIcon(L.icon({
						iconUrl: this.iconURL,
						iconSize: [0, 0],
						iconAnchor: [0, 0],
						popupAnchor: [0, 0]
					}))
				}
			}
		})
	}
	handleHover(e){
		//console.log(`Latitude:${e.latlng.lat.toFixed(5)}, Longitude:${e.latlng.lng.toFixed(5)}`)
		for(let i of document.getElementsByClassName("latlngCoor")){
			i.innerText = `Latitude:${e.latlng.lat.toFixed(5)}, Longitude:${e.latlng.lng.toFixed(5)}`
		}
	}
	handleLogin(e){
		e.preventDefault();
		console.log(e.currentTarget);
	}
	
	naviagtion()
	{
        this.handleMenuIcon()
	}
	async mainContent()
	{
		
         L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
		{
			attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(this.map)
	}
	async router()
	{
		"/" === this.pathname && this.mainContent()
	}
	addEventListeners()
	{
		this.map.on("click", t => this.mapClickHandler(t))
        document.querySelector("#map").addEventListener("contextmenu", e => this.contextMenuhandler(e))
		this.map.on("zoomend", t => this.handleZoom(t))
		this.map.on("mousemove", t => this.handleHover(t))
		document.querySelector(".loginWrapper").addEventListener("click", e=>{
			this.handleLogin(e)
		})
	}
}
export default function main()
{
	let t, e = (
	{
		getInstance: function ()
		{
			if (!t)
			{
				t = function instantiateMain()
				{
					let instance = new Main;
					instance.naviagtion();
					instance.router();
					instance.addEventListeners();
					return instance;
				}()
			}

			return t;
		}
	}).getInstance();
	if (e) return "Success!"
};