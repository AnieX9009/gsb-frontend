import {
    Image,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    useColorScheme,
    Alert,
    ActivityIndicator
  } from 'react-native';
  import React, {useState} from 'react';
  import {Colors} from 'react-native/Libraries/NewAppScreen';
  import Carousel from '../../components/Carousel';
  import countryFlag from '../../assets/india.png';
  
  import appleLogo from '../../assets/apple.png';
  import googleLogo from '../../assets/google.png';
  import fbLogo from '../../assets/fb.png';
  import {useNavigation} from '@react-navigation/native';
  import {useDispatch, useSelector} from 'react-redux';
  import {signupFailure, signupStart, signupSuccess} from '../../redux/authSlice';
  import axios from 'axios';
  import {postData} from '../../global/server';
  import {RootState} from '../../redux/store';
import CarouselCopy from '../../components/CarouselCopy';
  
  const SignIn = () => {
    const isDarkMode = useColorScheme() === 'dark';
    const [phoneNumber, setPhoneNumber] = useState('');
  
    const backgroundStyle = {
      backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };
  
    const navigation = useNavigation();
  
    const dispatch = useDispatch();
    const {isFetching, error, isAuth} = useSelector(
      (state: RootState) => state.auth,
    );
  
    const [isLoading, setIsLoading] = useState(false);

    const handleSignUp = async () => {
      setIsLoading(true); // Start loading
      console.log('Signing Up');
      console.log(phoneNumber);
      dispatch(signupStart());
  
      try {
        const res = await postData(
          '/api/auth/phone-login',
          { phone: `+91${phoneNumber}` },
          null,
          null,
        );
        console.log(res);
        dispatch(signupSuccess(res?.data));
        const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
        if (cleanNumber.length >= 10) {
        navigation.navigate('Verification', { phoneNumber: `+91${phoneNumber}` });
      } else {
        Alert.alert(
          'Invalid Phone Number',
          'Please enter a valid phone number with at least 10 digits'
        );
      }
      } catch (err) {
        dispatch(signupFailure());
        console.log(err);
      } finally {
        setIsLoading(false); // Stop loading whether success or failure
      }
    };
  
    return (
      <SafeAreaView>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            translucent backgroundColor="transparent"
        />
  
        <View style={{position: 'relative', height: '100%'}}>
          <CarouselCopy />
          <View style={styles.bottomContainer}>
            <Text style={styles.sectionTitle}>Phone Number</Text>
            <View style={styles.inputContainer}>
              {/* Country Flag Section */}
              <View style={styles.flagContainer}>
                {/* Your country flag component goes here */}
                <Image source={countryFlag} />
              </View>
              {/* Phone Number Input Section */}
              <TextInput
                style={styles.input}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
                onChangeText={text => setPhoneNumber(text)}
              />
            </View>
            {/* Button */}
            <TouchableOpacity
            style={[
              styles.button,
              // Optional: add disabled style
              isLoading && { opacity: 0.7 }
            ]}
            disabled={isLoading}
            onPress={handleSignUp}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.buttonText}>Get Started</Text>
            )}
          </TouchableOpacity>
            {/* Logos and Text */}
            <Text style={styles.footerText}>On Connect With</Text>
            <View style={styles.logosContainer}>
              {/* Three logos go here */}
              <Image source={googleLogo} style={styles.logo} />
              <Image source={appleLogo} style={styles.logo1} />
              <Image source={fbLogo} style={styles.logo} />
            </View>
            <Text style={styles.footerText}>
              By continuing you agree to the{' '}
              <Text style={{color: '#FFA800', fontWeight: 'bold'}}>
                Term of service
              </Text>{' '}
              and{' '}
              <Text style={{color: '#FFA800', fontWeight: 'bold'}}>Policies</Text>
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  };
  
  export default SignIn;
  
  const styles = StyleSheet.create({
    sectionContainer: {
      marginTop: 32,
      paddingHorizontal: 24,
    },
    sectionDescription: {
      marginTop: 8,
      fontSize: 18,
      fontWeight: '400',
    },
    highlight: {
      fontWeight: '700',
    },
  
    bottomContainer: {
      position: 'absolute',
      backgroundColor: 'white',
      height: '43%',
      width: '100%',
      bottom: 0,
      borderTopRightRadius: 30,
      borderTopLeftRadius: 30,
      padding: 20,
      
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '600',
      marginBottom: 10,
      color: 'black',
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
      borderColor: 'gray',
      borderWidth: 0.5,
      borderRadius: 5,
      paddingLeft: 20,
    },
    flagContainer: {
      marginRight: 10,
      // Add styles for your country flag container
    },
    input: {
      flex: 1,
      height: 40,
      borderWidth: 0,
      paddingHorizontal: 10,
      color: 'black',
    },
    button: {
      backgroundColor: '#F6AF24',
      paddingVertical: 15,
      borderRadius: 8,
      alignItems: 'center',
      marginBottom: 20,
    },
    buttonText: {
      color: 'black',
      fontSize: 16,
      fontWeight: 'bold',
    },
    logosContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 25,
      marginBottom: 10,
      alignItems: 'center'
    },
    logo: {
      width: 24,
      height: 25,
      // Add other styles for your logos
    },
    logo1: {
        width: 24,
        height: 30,
        // Add other styles for your logos
      },
    footerText: {
      textAlign: 'center',
      fontSize: 14,
      color: 'gray',
      marginBottom: 10,
    },
  });
  