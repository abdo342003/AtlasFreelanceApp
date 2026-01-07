import React, { Component } from 'react'
import { View, ScrollView, StyleSheet } from 'react-native'

class ToDoApp extends Component {
render() {
return (
<View style={styles.container}>
<ScrollView keyboardShouldPersistTaps='always'
style={styles.content}>
<View/>
</ScrollView>
</View>
)
}
}
const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: '#f5f5f5'
},
content: {
flex: 1,
paddingTop: 60
}
})
export default ToDoApp