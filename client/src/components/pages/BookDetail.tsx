import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Button, Linking } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { IBook } from '../../types/book';
import { AuthContext } from '../../stores/authStore';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/AntDesign';

type RootStackParamList = {
  apply: { book: IBook };
  edit: { book: IBook };
  permitForm: { book: IBook };
  readForm: { book: IBook };
};

type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'apply'>;

type ScreeenNavigationProp = StackNavigationProp<RootStackParamList, 'edit' | 'permitForm' | 'readForm'>

interface Props {
  navigation: ScreeenNavigationProp
  route: ProfileScreenRouteProp;
}

export default function BookDetail({ navigation, route }: Props) {
  const [book, setBook] = useState<IBook>(route.params.book);
  const date = new Date(route.params.book.createdAt);
  const dateMonth = date.getMonth() + 1;
  const dateDate = date.getDate();
  const dateYear = date.getFullYear();
  const {loginState} = useContext(AuthContext);
  return (
    <View style={styles.container}>
      {book && (
        <View style={styles.card}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 30,
              textAlign: 'center',
              marginBottom: 10,
            }}
          >
            {book.status}
          </Text>
          <Text style={styles.text}>申請した人: {book.username}</Text>
          <Text style={styles.text}>
            申請日: {dateYear}-{dateMonth}-{dateDate}
          </Text>
          <Text style={styles.text}>タイトル: {book.title}</Text>
          <Text style={styles.text}>本の簡単な詳細: {book.description}</Text>
          <Text style={styles.text}>読みたい理由: {book.reason}</Text>
          {book.status === '許可' && (
            <TouchableOpacity onPress={() => Linking.openURL(book.affiliateUrl)}><Text style={{marginBottom: 10,fontSize: 16}}>本を購入する<Icon name='arrowright' size={16} style={{ marginLeft: 10 }} /></Text></TouchableOpacity>
          )}
          {loginState.username === book.username && (
            <>
              <View style={{ marginBottom: 10 }}>
                <Button title='編集' onPress= {() => navigation.navigate('edit', {book: book})}  />
              </View>
            </>
          )}
          {book.status === '申請中' && (
            <Button title='許可画面へ' onPress={() => navigation.navigate('permitForm', { book: book })} />
          )}
          {loginState.username === book.username && book.status === '許可' && (
            <Button title='読了画面へ' onPress={() => navigation.navigate('readForm', { book: book })} />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    borderRadius: 6,
    elevation: 3,
    backgroundColor: '#fff',
    shadowOffset: {width: 1, height: 1},
    shadowColor: '#333',
    shadowOpacity: .3,
    shadowRadius: 2,
    marginHorizontal: 4,
    marginVertical: 4,
    width: 290,
    paddingHorizontal: 40,
    paddingVertical: 20,
  },
  text: {
    marginBottom: 10,
    fontSize: 18
  },
  fixToText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    width: 80,
  },
});
