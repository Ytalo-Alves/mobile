import { View, Text} from 'react-native'
import { s } from './styles'
import { Step } from '../step'

export function Steps(){
  return(
    <View style={s.container}>
      <Text style ={s.title}>Veja como funciona:</Text>
      <Step
        title='Item 1'
        description='descrição do item 1'
      />
    </View>
  )
}