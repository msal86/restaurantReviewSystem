import React, {useEffect} from 'react';
import {FlatList, Text, TouchableOpacity} from 'react-native';
import {Avatar, ListItem, Rating} from 'react-native-elements';
import {connect} from 'react-redux';

import {Strings} from '../../Themes/Strings';
import FormButton from '../../Components/Button';
import AuthActions from '../../Redux/AuthRedux';
import RestActions from '../../Redux/RestaurantRedux';
import styles from './styles';

function HomeScreen(props) {
  const {onFetchRestaurantsList, navigation, data} = props;

  useEffect(() => {
    navigation?.setOptions({
      headerRight: () => (
        <FormButton title={Strings.logout} onPress={() => props?.onLogout()} />
      ),
    });
  }, [navigation]);

  useEffect(() => {
    onFetchRestaurantsList();
  }, []);

  function onCLickItem(item) {
    return props?.navigation?.navigate({
      name: 'RestaurantDetails',
      params: {restaurantId: item?._id},
    });
  }

  function renderListItem({item, index}) {
    const {image, name, description, averageRating = 0} = item || {};
    return (
      <TouchableOpacity activeOpacity={0.6} onPress={() => onCLickItem(item)}>
        <ListItem key={item._id} bottomDivider>
          <Avatar size="large" rounded source={{uri: image}} />
          <ListItem.Content>
            <ListItem.Title>{name}</ListItem.Title>
            <ListItem.Subtitle>
              {description.slice(0, 30)}...
              <Text style={styles.readMore}>{Strings.readMore}</Text>
            </ListItem.Subtitle>
          </ListItem.Content>
          <Rating imageSize={15} readonly startingValue={averageRating} />
          <ListItem.Chevron />
        </ListItem>
      </TouchableOpacity>
    );
  }

  return (
    <FlatList
      keyExtractor={item => String(item?._id)}
      extraData={props}
      data={data}
      renderItem={renderListItem}
    />
  );
}

const mapDispatchToProps = dispatch => ({
  onLogout: () => dispatch(AuthActions.logout()),
  onFetchRestaurantsList: () => dispatch(RestActions.restaurantsList()),
});

const mapStateToProps = ({restaurants: {restaurantsList = []} = {}}) => ({
  data: restaurantsList,
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);