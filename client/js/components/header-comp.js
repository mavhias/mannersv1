Template.helperComp.helpers({
  view: () => {
    if (!!Meteor.user().profile.type && Meteor.user().profile.type === "host") {
      return true;
    } else {
      return false;
    }
  }
});


UI.registerHelper('getHeader', (id) => {
  let data;
  if (!!id) {
    data = Meteor.users.findOne(id).profile.type;

    if (!!data && data === 'host') {
      return `<header class="header">
      <div class="expanded row">
        <div class="medium-1 columns">
          <i class="fa fa-bars" id="menu-open"></i>
          <a href="/accueilhote"><img class="logo show-for-small-only" src="/images/logo.svg" alt="Manners" height="120" width="200"></a>
          <a href="/accueil" class="comment-link header-item show-for-small-only" style="font-size: 14px;">Espace Client</a>
        </div>

        <div class="medium-2 columns">
          <a href="/accueilhote"><img class="logo show-for-medium" src="/images/logo.svg" alt="Manners" height="120" width="200"></a>
        </div>

        <div class="medium-6 columns text-left">
          {{#unless currentUser}}
          <div class="comment-wrapper button-wrapper">
            <a class="button-colored comment-link header-item show-for-medium" style="color:#fbae17; font-size: 14px;" href="/accueil">ESPACE CLIENT</a>
          </div>{{/unless}}
          <div class="comment-wrapper">
            <a href="/comment-ca-marche" id="header-phone" style="font-size: 14px;" class="comment-link header-item"><i class="fa fa-phone"></i>01 76 39 00 01</a>
          </div>
          <div class="comment-wrapper dropdown dropdown-toggle">
            <a href="#" class="comment-link header-item ">AIDE <b class="caret"></b></a>
            <ul class="dropdown-menu">
              <li><a href="/comment-ca-marche">Comment ça marche</a></li>
              <li class="divider"></li>
              <li><a href="/questions-frequentes">Questions fréquentes</a></li>
              <li class="divider"></li>
              <li><a href="/tenues">Les tenues</a></li>
              <li class="divider"></li>
              <li><a href="/contact">Contactez-nous</a></li>
            </ul>
          </div>{{#unless currentUser}}
          <div class="comment-wrapper ">
            <a class="comment-link header-item show-for-medium" style="font-size: 14px;" href="/inscrivez-vous">INSCRIPTION</a>
          </div>
          <div class="comment-wrapper ">
            <a class="comment-link header-item show-for-medium" style="font-size: 14px;" href="/connexion">CONNEXION</a>
          </div>{{/unless}}{{#if currentUser}}
          <div class="pull-right customer_name cn-ac">
            <div class="inline-block dropdown dropdown-toggle customer_mt">
              <div class="comment-wrapper"><img class="customer_photo radius" src="{{getImage currentUser._id}}" alt="Votre photo ici">
                <div class="header-item"><span class="inline-block"><br>{{currentUser.profile.firstname}} {{currentUser.profile.name}}</span>
                </div>

              </div>
              <ul class="dropdown-menu">
                <li><a href="/partenaire/mes-missions">Mes missions</a></li>
                <li class="divider"></li>
                <li><a href="/partenaire/historique">mon historique</a></li>
                <li class="divider"></li>
                <li><a href="/partenaire/profil">mon profil</a></li>
                <li class="divider"></li>
                <li><a href="/partenaire/messagerie">Messagerie</a></li>
                <li class="divider"></li>
                <li><a href="/partenaire/compte/">Mon compte</a></li>
                <li class="divider"></li>
                {{>logoutC}}
              </ul>
            </div>
          </div>
          {{/if}}
        </div>
      </div>


      <div class="expanded row">
        <div class="medium-11 medium-offset-1">
        </div>
      </div>
    </header>`;
    } else {
      return `<header class="header">
      <div class="expanded row">
        <div class="medium-1 columns">
          <i class="fa fa-bars" id="menu-open"></i>
          <a href="/accueil"><img class="logo show-for-small-only" src="/images/logo.svg" alt="Manners" height="120" width="200"></a>
          <a href="/accueilhote" class="comment-link header-item show-for-small-only" style="font-size: 14px;">Espace Partenaire</a>
        </div>
        <div class="medium-2 columns">
          <a href="/accueil"><img class="logo show-for-medium" src="/images/logo.svg" alt="Manners" height="120" width="200"></a>
        </div>
        <div class="medium-6 columns text-left">
          {{#unless currentUser}}
          <div class="comment-wrapper button-wrapper">
            <a class="button-colored comment-link header-item show-for-medium" style="color:#fbae17; font-size: 14px;" href="/accueilhote">ESPACE PARTENAIRE</a>
          </div>{{/unless}}
          <a href="/nouvelle-mission/1" class="button-colored header-item reversed">Créer une mission</a>
          <div class="comment-wrapper">
            <a href="/comment-ca-marche" id="header-phone" style="font-size: 14px;" class="comment-link header-item"><i class="fa fa-phone"></i>01 76 39 00 01</a>
          </div>
          <div class="comment-wrapper dropdown dropdown-toggle">
            <a href="#" class="comment-link header-item ">AIDE <b class="caret"></b></a>
            <ul class="dropdown-menu">
              <li><a href="/comment-ca-marche">Comment ça marche</a></li>
              <li class="divider"></li>
              <li><a href="/questions-frequentes">Questions fréquentes</a></li>
              <li class="divider"></li>
              <li><a href="/tenues">Les tenues</a></li>
              <li class="divider"></li>
              <li><a href="/contact">Contactez-nous</a></li>
            </ul>
          </div>{{#unless currentUser}}
          <div class="comment-wrapper ">
            <a class="comment-link header-item show-for-medium" style="font-size: 14px;" href="/inscrivez-vous">INSCRIPTION</a>
          </div>
          <div class="comment-wrapper ">
            <a class="comment-link header-item show-for-medium" style="font-size: 14px;" href="/connexion">CONNEXION</a>
          </div>{{/unless}}{{#if currentUser}}
          <div class="pull-right customer_name cn-ac">
            <div class="inline-block dropdown dropdown-toggle customer_mt">
              <div class="comment-wrapper"><img class="customer_photo radius" src="{{getImage currentUser._id}}" alt="Votre photo ici">
                <div class="header-item"><span class="inline-block">{{myCompany}}<br>{{currentUser.profile.nameManager}} {{currentUser.profile.lastNameManager}}</span>
                </div>

              </div>
              <!--<div class="comment-wrapper">
                <div class="crop-photo little round inline"><img id="header-img" class="customer_photo header-item" src="{{getImage currentUser._id}}" alt="Votre photo ici"></div>
                <div class="header-item .customer_name"><span class="inline-block">{{myCompany}}<br>{{currentUser.profile.nameManager}} {{currentUser.profile.lastNameManager}}</span>
                </div>
              </div>-->
              <ul class="dropdown-menu">
                <li><a href="/client/mes-missions">Mes missions</a></li>
                <li class="divider"></li>
                <li><a href="/client/profils-favoris">Mes recommandations</a></li>
                <li class="divider"></li>
                <li><a href="/client/history">Mon historique</a></li>
                <li class="divider"></li>
                <li><a href="/client/messagerie">Messagerie</a></li>
                <li class="divider"></li>
                <li><a href="/client/compte">Mon compte</a></li>
                <li class="divider"></li>
                {{>logoutC}}
              </ul>
            </div>
          </div>
          {{/if}}
        </div>
      </div>
    </header>`;
    }
  }
  return false;


});
