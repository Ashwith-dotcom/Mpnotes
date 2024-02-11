import React, { useState, useEffect, useLayoutEffect } from 'react'
import { SafeAreaView, View, ScrollView, TextInput, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Style from './style';
import Save from '../../components/saveNote';
import Delete from '../../components/delNote';
import { Button } from 'react-native-web';
import Voice from '@react-native-voice/voice';
import { StatusBar } from 'expo-status-bar';



export default function Notes({route,navigation}){
    const [date, setDate] = useState(new Date())
    const [note,setNote] = useState({
        title:'',
        note:'',
        date: date,
        notificationId: null
    });
    const [modalVisible, setModalVisible] = useState(false);
    const [pitch, setPitch] = useState('');
    const [error, setError] = useState('');
    const [end, setEnd] = useState('');
    const [started, setStarted] = useState('');
    const [result, setResult] = useState([]);
    const [partialResults, setPartialResults] = useState([]);

    useEffect(() => {
      //Setting callbacks for the process status
      Voice.onSpeechStart = onSpeechStart;
      Voice.onSpeechEnd = onSpeechEnd;
      Voice.onSpeechError = onSpeechError;
      Voice.onSpeechResults = onSpeechResults;
      Voice.onSpeechPartialResults = onSpeechPartialResults;
      Voice.onSpeechVolumeChanged = onSpeechVolumeChanged;
  
      return () => {
        //destroy the process after switching the screen
        Voice.destroy().then(Voice.removeAllListeners);
      };
    }, []);
    const onSpeechStart = (e) => {
      //Invoked when .start() is called without error
      console.log('onSpeechStart: ', e);
      setStarted('√');
    };
  
    const onSpeechEnd = (e) => {
      //Invoked when SpeechRecognizer stops recognition
      console.log('onSpeechEnd: ', e);
      setEnd('√');
    };
  
    const onSpeechError = (e) => {
      //Invoked when an error occurs.
      console.log('onSpeechError: ', e);
      setError(JSON.stringify(e.error));
    };
  
    const onSpeechResults = (e) => {
      //Invoked when SpeechRecognizer is finished recognizing
      console.log('onSpeechResults: ', e);
      let text = e.value[0]
      setResult(text);
      setNote({ ...note, note: text })
      // setNote({note:e.value})
    };
    const onSpeechPartialResults = (e) => {
      //Invoked when any results are computed
      console.log('onSpeechPartialResults: ', e);
      let text = e.value[0]
      setPartialResults(text);
    };
  
    const onSpeechVolumeChanged = (e) => {
      //Invoked when pitch that is recognized changed
      console.log('onSpeechVolumeChanged: ', e);
      let text = e.value[0]
      setPitch(text);
    };
  
    const startRecognizing = async () => {
      //Starts listening for speech for a specific locale
      try {
        await Voice.start('en-US');
        setPitch('');
        setError('');
        setStarted('');
        setResult([]);
        setPartialResults([]);
        setEnd('');
      } catch (e) {
        //eslint-disable-next-line
        console.error(e);
      }
    };
  
    const stopRecognizing = async () => {
      //Stops listening for speech
      try {
        await Voice.stop();
      } catch (e) {
        //eslint-disable-next-line
        console.error(e);
      }
    };
  
    const cancelRecognizing = async () => {
      //Cancels the speech recognition
      try {
        await Voice.cancel();
      } catch (e) {
        //eslint-disable-next-line
        console.error(e);
      }
    };
  
    const destroyRecognizer = async () => {
      //Destroys the current SpeechRecognizer instance
      try {
        await Voice.destroy();
        setPitch('');
        setError('');
        setStarted('');
        setResult([]);
        setPartialResults([]);
        setEnd('');
      } catch (e) {
        //eslint-disable-next-line
        console.error(e);
      }
    };


    useEffect(()=>{
        if(route.params.note){
            setNote(route.params.note);
        }
    },[])

    useLayoutEffect(()=>{
        navigation.setOptions({
            headerRight: () => {
                return(
                    <View style={{width: 150, flexDirection:'row', justifyContent: 'space-between', marginRight: 30}}>
                        <TouchableOpacity onPress={()=>Save(note, navigation)}>
                            <Icon name="save" size={24} color="black"/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>setModalVisible(!modalVisible)}>
                            <Icon name="bells" size={24} color="black" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>Delete(note, navigation)}>
                            <Icon name="delete" size={24} color="black"/>
                        </TouchableOpacity>
                    </View>
                )
            }  
        })
    },[navigation,note])

    return(
        <SafeAreaView style={Style.conteiner}>
            <TextInput 
                style={Style.txtTitleNote} 
                autoFocus={true} 
                maxLength={40}
                value={note.title} 
                placeholder={'Title'}
                onChangeText={text=>setNote({ ...note, title: text })}
            >
            </TextInput>
            <View style={{ flexDirection: 'column', alignContent: 'center'}}>
                <TouchableOpacity onPress={startRecognizing}>
                    <Text style={{color: '#1f618d', fontWeight: 'bold'}}>Start</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={stopRecognizing}>
                    <Text style={{color: '#1f618d', fontWeight: 'bold'}}>Stop</Text>
                </TouchableOpacity>
            </View>
            <ScrollView>
            <TextInput
              value={result}
              placeholder="your text"
              style={{ flex: 1 }}
              onChangeText={text => setResult(text)}
            />
            </ScrollView>   
        </SafeAreaView>
    )
}
{/* <TextInput
                style={Style.txtInput}
                key={`result-${index}`}
                value={result}
                placeholder={'content here'}
                onChangeText={text=>setNote({...note,note:text})}
                >
              </TextInput> */}