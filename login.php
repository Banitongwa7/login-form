<?php
    $serveur = "localhost";
    $user = "root";
    $mot_de_passe = "";
    $nom_base_de_donnees = "mydb";

    $connexion = mysqli_connect($serveur, $user, $mot_de_passe, $nom_base_de_donnees);

    if (!$connexion) {
        die("Échec de la connexion à la base de données : " . mysqli_connect_error());
    }

    // Vérification des données de connexion (à adapter selon votre logique)
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $email = $_POST["email"];
        $password = $_POST["password"];

        $requete = "SELECT * FROM users WHERE email = '$email' AND password = '$password'";
        $resultat = mysqli_query($connexion, $requete);

        if ($resultat && mysqli_num_rows($resultat) > 0) {
            header("Location: home.html");
        } else {
            echo "Échec de la connexion. Vérifiez votre nom d'utilisateur et votre mot de passe.";
        }
    }

    mysqli_close($connexion);
?>
