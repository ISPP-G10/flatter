import React, { useState } from "react";
import "../../static/css/components/favouriteButton.css";
import { useApolloClient } from "@apollo/client";
import propertiesAPI from "../../api/propertiesAPI";
import customAlert from "../../libs/functions/customAlert";

const FavouriteButton = ({ isFavourite, propertyId }) => {
  const [favourite, setFavourite] = useState(isFavourite);

  const client = useApolloClient();
  let userToken = localStorage.getItem("token", '');

  function addUsersToFavouriteProperty(user) {
    client
      .mutate({
        mutation: propertiesAPI.addUsersToFavouriteProperty,
        variables: {
          username: user,
          propertyId: parseInt(propertyId),
          userToken: userToken,
        },
      })
      .then((response) => {
        setFavourite(!favourite);
      })
      .catch((error) => {
        customAlert(error.message);
      });
  }

  function deleteUsersToFavouriteProperty(user) {
    client
      .mutate({
        mutation: propertiesAPI.deleteUsersToFavouriteProperty,
        variables: {
          username: user,
          propertyId: parseInt(propertyId),
          userToken: userToken,
        },
      })
      .then((response) => {
        setFavourite(!favourite);
      })
      .catch((error) => {
        customAlert(error.message);
      });
  }

  function handleOnClick() {
    const username = localStorage.getItem("user");

    if (favourite) {
      // Remove from favourites
      deleteUsersToFavouriteProperty(username);
    } else {
      // Add to favourites
      addUsersToFavouriteProperty(username);
    }
  }

  return (
    <button
      className={`favourite-button property-btn ${
        favourite ? "favourite" : ""
      }`}
      onClick={handleOnClick}
    >
      <img
        src={require("../../static/files/icons/estrella.png")}
        alt="fav icon"
      />
    </button>
  );
};

export default FavouriteButton;
