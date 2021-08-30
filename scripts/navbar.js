const navbarInit = () => {
  let navbar = document.getElementById("id_navbar");
  navbar.innerHTML = `
    <nav class="navbar navbar-fixed-top navbar-inverse">
      <div class="container-fluid">
        <div class="navbar-header">
          <a class="navbar-brand" href="index.html">String Algorithms</a>
  				<button class="navbar-toggle" data-toggle="collapse"
  						data-target="#id_navbar2" aria-controls="id_navbar2"
  						aria-expanded="false" aria-label="Toggle navigation">
  					<span class="glyphicon glyphicon-menu-hamburger" style="color: #D3D3D3"></span>
  				</button>
        </div>
        <div id="id_navbar2" class="collapse navbar-collapse">
          <ul class="nav navbar-nav vertical-align mr-auto">
            <li id='id_navbar_index'><a href="index.html">Home</a></li>
            <li id='id_navbar_prefix_function'><a href="prefix-function.html">Prefix function</a></li>
            <li id='id_navbar_z_function'><a href="z-function.html">Z-function</a></li>
            <li id='id_navbar_trie'><a href="trie.html">Trie</a></li>
          </ul>
          <ul class="nav navbar-nav navbar-right">
            <li id='id_toggle_dark_mode'><a href="#" onclick="return toggleDarkMode();"><span class="glyphicon glyphicon-adjust"></a></span></li>
          </ul>
        </div>
      </div>
    </nav>
    `;
};
navbarInit();

const setActive = (id) => {
  let tab = document.getElementById(id);
  let atribute = document.createAttribute("class");
  atribute.value = "active";
  tab.setAttributeNode(atribute);
};
