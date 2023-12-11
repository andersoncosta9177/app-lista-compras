import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet,StatusBar, TextInput, Alert, FlatList, TouchableOpacity } from 'react-native';
import Feather from 'react-native-vector-icons/Feather'
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const [productList, setProductList] = useState([]);
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [value, setValue] = useState('');

  useEffect(() => {
    // Carrega a lista do AsyncStorage ao iniciar o aplicativo
    loadProductList();
  }, []);

  useEffect(() => {
    // Atualiza a lista no AsyncStorage sempre que houver alterações
    saveProductList();
  }, [productList]);

  const addProduct = () => {
    if(productName  == ""){
      alert("Preencha o campo nome!")
      return
    }else if(quantity == ""){
      alert("Preencha o campo quantidade")
      return
    }else if(value == ""){
      alert("Preencha o campo valor!")
      return
    }
    const product = {
      name: productName,
      quantity: parseInt(quantity),
      value: parseFloat(value),
      totalValue: parseInt(quantity) * parseFloat(value)
    };

    setProductList([...productList, product]);
    setProductName('');
    setQuantity('');
    setValue('');
  };

  const deleteProduct = (index) => {
    const updatedList = [...productList];
    updatedList.splice(index, 1);
    setProductList(updatedList);
  };

  const editProduct = (index) => {
    const editedList = [...productList];
    const product = editedList[index];

    setProductName(product.name);
    setQuantity(product.quantity.toString());
    setValue(product.value.toString());

    editedList.splice(index, 1);
    setProductList(editedList);
  };

  const calculateTotalValue = () => {
    let totalValue = 0;
    productList.forEach((product) => {
      totalValue += product.totalValue;
    });
    return totalValue;
  };

  const saveProductList = async () => {
    try {
      await AsyncStorage.setItem('@productList', JSON.stringify(productList));
    } catch (error) {
      console.log('Erro ao salvar lista de produtos no AsyncStorage:', error);
    }
  };

  const loadProductList = async () => {
    try {
      const storedProductList = await AsyncStorage.getItem('@productList');
      if (storedProductList !== null) {
        setProductList(JSON.parse(storedProductList));
      }
    } catch (error) {
      console.log('Erro ao carregar lista de produtos do AsyncStorage:', error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#292c35" barStyle="light-content" />
      <Text style={styles.textTitle}>Lista de compras</Text>
      <View style={styles.containerInputs} >
        <TextInput
          style={styles.nameProduct}
          placeholder="Nome do Produto"
          maxLength={8}
          placeholderTextColor="#aaa"
          value={productName}
          onChangeText={setProductName}
        />
        <TextInput
          
          placeholder="Quantidade"
          keyboardType="numeric"
          style={styles.quantityProduct}
          placeholderTextColor="#aaa"
          value={quantity}
          onChangeText={setQuantity}
        />
        <TextInput
          style={styles.valueProduct}
          placeholder="Valor"
          keyboardType="numeric"
          value={value}
          onChangeText={setValue}
          placeholderTextColor="#aaa"

        />
     
      
      </View>
      <View style={styles.info}>
        <View style={styles.infoNameContainer}>
        <Text style={styles.infoName}>Nome</Text>
        </View>
       
       <View style={styles.infoQuantContainer}>
       <Text style={styles.infoName}>Quant.</Text>
       </View>

        <View style={styles.infoValueContainer}>
        <Text style={styles.infoName}>Valor</Text>
        </View>

        <View style={styles.infoQuantContainer}>
        <Text style={styles.infoName}>Total</Text>
        </View>

        <View style={styles.infoAcoesContainer}>
        <Text style={styles.infoAcoes}>Ações</Text>
        </View>

       </View>
      <FlatList
        data={productList}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.containerListProducts}>
            <View style={styles.nameItem}>
            <Text  style={styles.textNameItem}>{item.name}</Text>
              </View>

            <View style={styles.quantityItem}>
            <Text  style={styles.textQuantityItem}>{item.quantity}</Text>

              </View>



            <View style={styles.valueItem}> 
            <Text style={styles.textValueItem} >{(item.value).toFixed(2)}</Text>

              </View>

            <View style={styles.totalProduct}>
            <Text style={styles.textTotalProduct} >{(item.totalValue).toFixed(2)}</Text>

              </View>
             <View style={styles.btns}>
             <Feather style={styles.btnEdit} onPress={()=>editProduct(index)}  name="edit" size={24} color="#104E8B"/>
            <Feather onPress={()=>deleteProduct(index)}  name="trash" size={24} color="#A52A2A"/>
              </View>
          </View>
        )}
      />
   
      <Text style={styles.totalProducts}>
         Total R$: {calculateTotalValue().toFixed(2)}
      </Text>
      <TouchableOpacity style={styles.btnAdd} onPress={addProduct}>
        <Feather name="plus" size={28} color="#17181d" /> 
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#292c35',
    marginTop: 0
  },

  textTitle:{
    fontSize: 22,
    color: '#aaa',
    textAlign: 'center',
    fontWeight: '500',
    marginTop: 0,
    width: '96%',
    marginHorizontal: '2%',
    backgroundColor: '#17181d',
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    // paddingBottom: 4,
    // paddingTop: 4,
    marginBottom: -12,
    padding: 12

  },

  // #e09145
  // #17181d
  // #fcd9b8
  // #292c35
  // #254252
// #171c2d
// #e37239
// #f9982f
  btnAdd:{
     width: 54,
     height: 54,
     backgroundColor: '#f9982f',
     borderRadius: 27,
     justifyContent: 'center',
     alignItems: 'center',
     right: 18,
     bottom: 18,
     position: 'absolute'
     
  },


  containerInputs:{
    flexDirection: 'column',
    width: '96%',
    marginHorizontal: '2%',
    backgroundColor: '#17181d',
    borderBottomRightRadius: 7,
    borderBottomLeftRadius: 7,
    marginBottom: 12
    
  },
  nameProduct:{
    width: '94%',
    marginHorizontal: '3%',
    backgroundColor: '#292c35',
    marginTop: 20,
    borderRadius: 6,
    letterSpacing: 1,
    paddingLeft: 9,
  color: '#aaa'

    
    
  },
quantityProduct:{
  width: '94%',
  marginHorizontal: '3%',
  backgroundColor: '#292c35',
  marginTop: 10,
  borderRadius: 6,
  letterSpacing: 1,
  paddingLeft: 9,
  color: '#aaa'

},

valueProduct:{
  width: '94%',
  marginHorizontal: '3%',
  backgroundColor: '#292c35',
  marginTop: 10,
  borderRadius: 6,
  marginBottom: 20,
  letterSpacing: 1,
  paddingLeft: 9,
  color: '#aaa'


},
totalProducts:{
  marginTop: 12,
  color: '#f9982f',
  fontSize: 22,
  bottom: 23,
  left: 10,
  backgroundColor: '#17181d',
  // alignSelf: 'auto'
  width: '50%',
  padding: 7,
  borderRadius: 8,
  textAlign: 'center'
},

info:{
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '96%',
  marginHorizontal: '2%',
  backgroundColor: '#e37239',
  borderTopLeftRadius: 7,
  borderTopRightRadius: 7,
  padding: 6,
  borderBottomWidth: 1,
  borderBottomColor: '#171c2d'
},
infoNameContainer:{
  width: '20%',
   justifyContent: 'center',
   alignItems: 'center'
},

infoQuantContainer:{
  width: '20%',
   justifyContent: 'center',
   alignItems: 'center'
},
infoValueContainer:{
  width: '20%',
   justifyContent: 'center',
   alignItems: 'center'
},
infoTotalContainer:{
  width: '20%',
   justifyContent: 'center',
   alignItems: 'center'
},

infoAcoesContainer:{
  width: '16%',
   justifyContent: 'center',
   alignItems: 'center'

  
},
infoName:{
    color: '#292c35',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 15,

},
infoQuantity:{
  color: '#254252',
  fontWeight: 'bold',
  textAlign: 'center',
  fontSize: 15,
},
infoValue:{
  color: '#254252',
  fontWeight: 'bold',
  textAlign: 'center',
  fontSize: 15,
},
infoTotal:{
  color: '#254252',
  fontWeight: 'bold',
  textAlign: 'center',
  fontSize: 15,
},
infoAcoes:{
  color: '#292c35',
  fontWeight: 'bold',
  textAlign: 'center',
  fontSize: 15,
},




containerListProducts:{
  width: '96%',
  marginHorizontal: '2%',
  flexDirection: 'row',
  justifyContent: 'space-between',
  backgroundColor: '#f9982f',
  borderBottomWidth: 1,
  borderColor: '#171c2d',
  padding: 4
},
nameItem:{
  width: '20%',
  justifyContent: 'center',
  alignItems: 'center',
  flexWrap: 'nowrap'

},

textNameItem:{
  color: '#292c35',
  fontWeight: 'bold',
  fontSize: 15,
  textAlign: 'center'
},

quantityItem:{
  width: '20%',
  justifyContent: 'center',
  alignItems: 'center',
},
textQuantityItem:{
  color: '#292c35',
  fontWeight: 'bold',
  fontSize: 15,
  textAlign: 'center'
},

valueItem:{
  width: '20%',
  justifyContent: 'center',
  alignItems: 'center',
},

textValueItem:{
  color: '#292c35',
  fontWeight: 'bold',
  fontSize: 15,
  textAlign: 'center'
},
totalProduct:{
  width: '20%',
  justifyContent: 'center',
  alignItems: 'center'

},

textTotalProduct:{
  color: '#292c35',
  fontWeight: 'bold',
  fontSize: 15,
  textAlign: 'center'
},



btns:{
  width: '16%',
  flexDirection: 'row',
  justifyContent: 'space-between',
  right: 3
},
btnEdit:{
    marginRight: 2
}

})


export default App;
