import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert } from "react-native";
import axios from "axios";

const apiKey = "AIzaSyAg2-9TnrFipJh32lFKrxuVtQuWoRIf23s"; // Replace with your YouTube API key

const OnlineSongs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const searchForSongs = async (query) => {
    try {
      const response = await axios.get("https://www.googleapis.com/youtube/v3/search", {
        params: {
          key: apiKey,
          q: query,
          type: "video",
          videoCategoryId: "10",
          videoEmbeddable: "true",
          videoSyndicated: "true",
          maxResults: 10,
        },
      });

      const videos = response.data.items;
      const audioVideos = videos.filter((video) => isAudio(video));
      return audioVideos;
    } catch (error) {
      console.error("Error searching for videos:", error);
      return [];
    }
  };

  const isAudio = (video) => {
    return true; // You can add your logic to filter audio-only videos
  };

  const handleSearch = async () => {
    if (!searchQuery) {
      Alert.alert("Error", "Please enter a search query.");
      return;
    }

    try {
      const audioVideos = await searchForSongs(searchQuery);
      setSearchResults(audioVideos);
    } catch (error) {
      console.error("Error while handling search:", error);
      setSearchResults([]);
      Alert.alert("Error", "An error occurred during the search.");
    }
  };

  return (
    <View>
      <Text style={{ fontSize: 24, fontWeight: "bold", margin: 16 }}>
        YouTube Music Song Search
      </Text>
      <TextInput
        placeholder="Search for songs"
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
        style={{
          padding: 10,
          margin: 16,
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 5,
        }}
      />
      <TouchableOpacity
        onPress={handleSearch}
        style={{
          backgroundColor: "#FF0000", // YouTube red color
          width: 100,
          height: 40,
          borderRadius: 5,
          alignItems: "center",
          justifyContent: "center",
          margin: 16,
        }}
      >
        <Text style={{ color: "white" }}>Search</Text>
      </TouchableOpacity>
      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.id.videoId}
        renderItem={({ item }) => (
          <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: "#ccc" }}>
            {item.snippet ? (
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>{item.snippet.title}</Text>
            ) : (
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>Title not available</Text>
            )}
            {item.snippet ? (
              <Text style={{ fontSize: 16, color: "#888" }}>{item.snippet.channelTitle}</Text>
            ) : (
              <Text style={{ fontSize: 16, color: "#888" }}>Channel not available</Text>
            )}
            <TouchableOpacity
              onPress={() => playOrDownloadSong(item.id.videoId)}
              style={{
                backgroundColor: "#007AFF",
                width: 150,
                height: 40,
                borderRadius: 5,
                alignItems: "center",
                justifyContent: "center",
                marginTop: 10,
              }}
            >
              <Text style={{ color: "white" }}>Play/Download</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const playOrDownloadSong = (videoId) => {
  // Implement the logic to play or download the selected audio song using the videoId
};

export default OnlineSongs;
