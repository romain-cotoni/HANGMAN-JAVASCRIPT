var lettre              = "";
var motCache            = "";
var motDecouvert        = new Array;
var lettresUtilisees    = new Array;
var longueurMotCache    = 0;
var nbLettresTrouvees   = 0;
var essais              = 0;        
var boolLettreTrouvee   = false;
var boolMotTrouve       = false;
var boolLettreUtilisee  = false;

var champsMotCache      = document.getElementById("champsMotCache");
var champsMotDecouvert  = document.getElementById("champsMotDecouvert");
var champsEssais        = document.getElementById("champsEssais");
var champsLettre        = document.getElementById("champsLettre");
var canvas              = document.getElementById("canvas");
var btnValiderLettre    = document.getElementById("btnValiderLettre");
var btnValiderRejouer   = document.getElementById("btnValiderRejouer");
var btnValiderMotCache  = document.getElementById("btnValiderMotCache");                       

var conteneur2 = document.getElementById("conteneur2");
var conteneur3 = document.getElementById("conteneur3");
var conteneur4 = document.getElementById("conteneur4");
var conteneur5 = document.getElementById("conteneur5");
var conteneur6 = document.getElementById("conteneur6");
var conteneur7 = document.getElementById("conteneur7");
var conteneur8 = document.getElementById("conteneur8");

btnValiderRejouer.addEventListener("click",validerRejouer,false);
btnValiderLettre.addEventListener("click",validerLettre,false);
btnValiderMotCache.addEventListener("click",validerMotCache,false);

function validerRejouer()
{
	conteneur6.style.display = "none";
	var radio1 = document.getElementsByName("radio1");
	var radio2 = document.getElementsByName("radio2");
	if(radio1[0].checked == true && radio2[0].checked == true)
	{
		rejouer();
	}
	else
	{
		terminer();
	}
}        

function rejouer()
{
	champsMotCache.value     = "";
	motDecouvert.length      = 0; //effacer le tableau
	lettresUtilisees.length  = 0; //effacer le tableau
	nbLettresTrouvees        = 0;
	essais                   = 0;
	boolLettreTrouvee        = false;
	boolMotTrouve            = false;
	boolLettreUtilisee       = false;
	mettreAjourTableauDeBord();
	canvas.style.display     = "none";
	conteneur4.style.display = "none";
	conteneur5.style.display = "none";
	conteneur6.style.display = "none";
	conteneur8.style.display = "block";
	var x = 10;
	var interval = setInterval(function(){compteur(--x,interval);},1000)
}
function compteur()
{
	conteneur8.getElementsByTagName("span")[0].innerHTML = arguments[0];
	if(arguments[0]===0)
	{
		clearInterval(arguments[1]);
		conteneur8.style.display = "none";
		conteneur2.style.display = "block";
        champsMotCache.focus();
	}
}

function terminer()
{
	canvas.style.display     = "none";
	conteneur4.style.display = "none";
	conteneur5.style.display = "none";
	conteneur6.style.display = "none";
	conteneur7.style.display = "block";            
}

function validerMotCache() //appuyer sur le bouton qui valide le mot à trouver
{            
    var regExp       = new RegExp("^[a-z\u00c0-\u00ff]+[a-z\u00c0-\u00ff]$","i");//reg exp lettres & accents
	motCache         = champsMotCache.value;         
	longueurMotCache = motCache.length;
    if(!motCache.match(regExp)) //vérifier si mdp vide ou invalide (chiffre & symboles)
	{
        champsMotCache.value = "";
		champsMotCache.focus();
		return;
	}
	for (var i=0; i<longueurMotCache; i++) //affecter des '*' à MotDecouvert
	{
	   motDecouvert.push('*');
	}
	mettreAjourTableauDeBord(); 
	conteneur2.style.display = "none";
	conteneur3.style.display = "block";
	canvas.style.display     = "block";  
    champsLettre.focus();
}                    

function validerLettre()          //appuyer sur le bouton qui valide la lettre choisie par le joueur
{
    var regExp = new RegExp("^[a-z\u00c0-\u00ff]$","i");//reg exp lettres & accents
	lettre = champsLettre.value;  //console.log(lettre);
	if(!lettre.match(regExp)) //vérifier si mdp vide ou invalide (chiffre & symboles) lettre === "") 
	{
        champsLettre.value = "";
		champsLettre.focus();
		return;
	}
		  
	for(var i=0; i<lettresUtilisees.length; i++)
	{
		if(lettresUtilisees[i] === lettre)
		{
			boolLettreUtilisee = true;
		}
	}
	if(boolLettreUtilisee === false)
	{
		for(var j=0; j<longueurMotCache; j++)
		{                            
			if(motCache.charAt(j) === lettre)
			{
				motDecouvert[j] = lettre;
				nbLettresTrouvees++;
				boolLettreTrouvee = true;
				lettresUtilisees.push(lettre);
				if(nbLettresTrouvees == longueurMotCache)
				{
					boolMotTrouve = true;
					gagne();
				}
			}
		}
	}
	if(boolLettreTrouvee === false || boolLettreUtilisee === true)
	{                
		verifierEssais();
	}
	mettreAjourTableauDeBord();
	boolLettreTrouvee  = false;
	boolLettreUtilisee = false;
}

function mettreAjourTableauDeBord()
{
	champsLettre.value = "";
	champsLettre.focus();
	conteneur3.getElementsByTagName("span")[0].innerHTML = essais;
	conteneur3.getElementsByTagName("span")[1].innerHTML = motDecouvert.join("");
	dessinerPendu(essais);
}

function verifierEssais()
{   
	essais++;
	if(essais>9)
	{                
		perdu();
	}            
}        

function perdu()//joueur 2 perd
{                          
	conteneur4.getElementsByTagName("span")[0].innerHTML = motCache;
	conteneur4.getElementsByTagName("span")[1].innerHTML = nbLettresTrouvees;
	conteneur3.style.display = "none";
	conteneur4.style.display = "block";  
	conteneur6.style.display = "block"; 
}

function gagne()//joueur 2 gagne
{   
	conteneur5.getElementsByTagName("span")[0].innerHTML = essais;
	conteneur3.style.display = "none";
	conteneur5.style.display = "block";
	conteneur6.style.display = "block";                         
}

//--------fonctions dessin du pendu --------
function dessinerSocle()
{
	var ctx = arguments[0];
	ctx.moveTo( 15, 140);//socle
	ctx.lineTo(100, 140);//           
}
function dessinerPoteau()
{
	var ctx = arguments[0];
	ctx.moveTo( 40, 140);//poteau
	ctx.lineTo( 40,  10);//            
}
function dessinerPoulie()
{
	var ctx = arguments[0];
	ctx.moveTo( 40,  10);//poulie
	ctx.lineTo(100,  10);//            
}
function dessinerCorde()
{
	var ctx = arguments[0];
	ctx.moveTo(100,  10);//corde
	ctx.lineTo(100,  20);//            
}
function dessinerTete()
{
	var ctx = arguments[0];
	ctx.moveTo(100,  20);
	ctx.arc(100, 30, 10, -Math.PI/2, Math.PI*2);            
}
function dessinerCorps()
{
	var ctx = arguments[0];
	ctx.moveTo(100,  40);//corps
	ctx.lineTo(100,  80);//            
}
function dessinerBrasGauche()
{
	var ctx = arguments[0];
	ctx.moveTo(100,  50);//bras gauche
	ctx.lineTo( 80,  70);//
}
function dessinerBrasDroit()
{
	var ctx = arguments[0];
	ctx.moveTo(100,  50);//bras droit
	ctx.lineTo(120,  70);//
}

function dessinerJambeGauche()
{
	var ctx = arguments[0];
	ctx.moveTo(100,  80);//jambe gauche
	ctx.lineTo( 80, 110);//
}

function dessinerJambeDroite()
{
	var ctx = arguments[0];
	ctx.moveTo(100,  80);//jambe droite
	ctx.lineTo(120, 110);//
}

var tab = [dessinerSocle,
		   dessinerPoteau,
		   dessinerPoulie,
		   dessinerCorde,
		   dessinerTete,
		   dessinerCorps,
		   dessinerBrasGauche,
		   dessinerBrasDroit,
		   dessinerJambeGauche,
		   dessinerJambeDroite];


function dessinerPendu()
{            
	var ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height); //effacer le canvas
	ctx.beginPath();
	for(var i=0;i<arguments[0];i++)
	{
		tab[i](ctx);
	}
	ctx.stroke();
}

//var tab = [[15,140,100,140],[40,140,40,10],[40,10,100,10],[100,10,100,20],[],[100,40,100,80],[100,50,80,70],[100,50,120,70],[100,80,80,110],[100,80,120,110]];
