import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, TextInput, TouchableOpacity,ScrollView, Image ,RefreshControl} from 'react-native';
import { AudioContext } from '../context/AudioProvider';
import { RecyclerListView, LayoutProvider, DataProvider } from 'recyclerlistview';
import AudioListItem from '../components/AudioListItem';
import Screen from '../components/Screen';
import OptionModal from '../components/OptionModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import {
  selectAudio,
} from '../misc/audioController';
import Constants from 'expo-constants';
const baseUrl = Constants.expoConfig.extra.BASE_URL;

export class AudioList extends Component {
  static contextType = AudioContext;

  constructor(props) {
    super(props);
    this.state = {
      userData: { username:'' },
      refreshing: false,
      optionModalVisible: false,
      isSortedByName: false,
      searchText: '', // Track user's search query
      currentPlayingIndex: -1, // Keep track of the currently playing item index
    };

    this.currentItem = {};
  }

  layoutProvider = new LayoutProvider(
    i => 'audio',
    (type, dim) => {
      switch (type) {
        case 'audio':
          dim.width = Dimensions.get('window').width;
          dim.height = 70;
          break;
        default:
          dim.width = 0;
          dim.height = 0;
      }
    }
  );


  async fetchUserData() {
    try {
      const get_token = await AsyncStorage.getItem('accessToken');

      if (get_token) {
        const response = await axios.get(`${baseUrl}/api/users/verify`, {
          headers: { Authorization: `Bearer ${get_token}` },
        });

        this.setState({ userData: response.data });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }

  handleRefresh = () => {
    this.setState({ refreshing: true });

    this.fetchUserData().finally(() => {
      this.setState({ refreshing: false });
    });
  };

  handleAudioPress = async (audio, index) => {
    await selectAudio(audio, this.context);
    this.setState({ currentPlayingIndex: index }); // Update the currently playing item index
  };

  componentDidMount() {
    this.context.loadPreviousAudio();
    this.fetchUserData();
  }

  rowRenderer = (type, item, index, extendedState) => {
    return (
      <AudioListItem
        title={item.filename}
        isPlaying={extendedState.isPlaying}
        activeListItem={
          (this.state.isSortedByName && index === this.state.currentPlayingIndex) || // When sorted by name
          (!this.state.isSortedByName && index === this.context.currentAudioIndex) // When sorted by default (added index comparison)
        }
        duration={item.duration}
        onAudioPress={() => this.handleAudioPress(item, index)} // Pass the index here
        onOptionPress={() => {
          this.currentItem = item;
          this.setState({ ...this.state, optionModalVisible: true });
        }}
      />
    );
  };

  navigateToPlaylist = () => {
    this.context.updateState(this.context, {
      addToPlayList: this.currentItem,
    });
    this.props.navigation.navigate('PlayList');
  };

  handleSortPress = () => {
    this.setState((prevState) => ({
      isSortedByName: !prevState.isSortedByName,
    }));
  };

  handleSearch = (text) => {
    this.setState({ searchText: text });
  };

  render() {
    const { isSortedByName, searchText } = this.state;
    const { dataProvider, isPlaying } = this.context;
    const { userData } = this.props.route.params;
    let filteredData = dataProvider.getAllData();
    const refresh = true;

    // console.log(userData);
    // Apply sorting by name if enabled
    if (isSortedByName) {
      filteredData = [...filteredData].sort((a, b) =>
        a.filename.localeCompare(b.filename)
      );
    }

    // Apply search filter
    if (searchText.trim() !== '') {
      filteredData = filteredData.filter((item) =>
        item.filename.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    return (
      <Screen>
      <ScrollView
        refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.handleRefresh} />}
      >
        <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile')}>
          <View style={styles.profileContainer}>
            <Image source={require('../../assets/icon.png')} style={styles.profileImage} />
            <View style={styles.profileText}>
              <Text style={styles.greetText}>Welcome,</Text>
              <Text style={styles.usernameText}>{this.state.userData.username}</Text>
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.searchContainer}>

          <TextInput
            placeholder="Search songs"
            style={styles.searchInput}
            onChangeText={this.handleSearch}
            value={this.state.searchText}
          />
             <TouchableOpacity
            onPress={this.handleSortPress}
            style={styles.sortButton}
          >
            <Text style={styles.sortText}>
              Sort:
              {isSortedByName ? ' By adding time' : ' By Name'}
            </Text>
          </TouchableOpacity>
        </View>
        {/* Other content goes here */}
      
      </ScrollView>
      <RecyclerListView style={{marginBottom:-300}}
          dataProvider={new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(
            filteredData
          )}
          layoutProvider={this.layoutProvider}
          rowRenderer={this.rowRenderer}
          extendedState={{ isPlaying }}
        />
        <OptionModal
          options={[
            {
              title: 'Add to playlist',
              onPress: this.navigateToPlaylist,
            },
          ]}
          currentItem={this.currentItem}
          onClose={() => this.setState({ ...this.state, optionModalVisible: false })}
          visible={this.state.optionModalVisible}
        />
      </Screen>
      
    );
  }
}

const styles = StyleSheet.create({
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25, // Make it a circle
    marginRight: 16,
  },
  profileText: {
    flexDirection: 'column',
  },
  greetText: {
    fontSize: 15,
  },
  usernameText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 8,
  },
  sortButton: {
    marginLeft: 16,
    paddingVertical: 8,
  },
  sortText: {
    fontSize: 15,
  }
});

export default AudioList;
