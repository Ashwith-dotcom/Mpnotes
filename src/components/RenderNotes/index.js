import React from 'react'
import { View, TouchableOpacity, Text} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';

import Style from './style'

export default function renderNote({item, navigation}){
    return(
        <TouchableOpacity style={Style.noteArea} onPress={()=>navigation.navigate('Notes', {note: item, search: true})}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={Style.txtNoteTitle} numberOfLines={2}>{item.title}</Text>
                {item.notificationId !== null && <Icon name="rocket" size={30} color="#900" />}
            </View>
            <Text style={Style.txtNote} numberOfLines={6}>{item.note}</Text>
        </TouchableOpacity>
    )
}
