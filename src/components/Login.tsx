import * as React from 'react';
import {
  IonButton,
  IonGrid,
  IonAvatar,
  IonIcon,
  IonInput,
  IonRouterLink,
  IonContent,
  IonRow,
  IonText,
  CreateAnimation
} from '@ionic/react';
import { lockClosedOutline } from 'ionicons/icons';
import './Login.css';

export interface LoginProps {
  email: string;
  password: string;
  isError: boolean;
  errorMessage: string;
  handleChange(data: any): any;
  submit(): void;
}

export interface LoginState {}

class Login extends React.Component<LoginProps, LoginState> {
  handleData = (type: any) => (event: any) => {
    this.props.handleChange({
      [type]: event.target.value
    });
  };
  render() {
    const { password, email, isError, errorMessage } = this.props;
    return (
      <IonContent fullscreen={true}>
        <div className="paper">
          <CreateAnimation
            play={true}
            duration={1500}
            iterations={1}
            fromTo={[
              {
                property: 'transform',
                fromValue: 'translateY(100px)',
                toValue: 'translateY(0px)'
              },
              { property: 'opacity', fromValue: '0', toValue: '1' }
            ]}
          >
            <IonAvatar>
              <IonIcon name={lockClosedOutline} />
            </IonAvatar>
            <IonText>
              <h1>Sign in</h1>
            </IonText>
            <div>
              <h4 className={isError ? 'errMessage' : 'message'}>
                {errorMessage}
              </h4>
            </div>
            <form className="form" noValidate>
              <IonInput
                required
                id="email"
                name="email"
                autocomplete="email"
                value={email}
                onIonChange={this.handleData('email')}
              />
              <IonInput
                required
                name="password"
                type="password"
                id="password"
                autocomplete="current-password"
                onIonChange={this.handleData('password')}
                value={password}
              />
              <IonButton
                className="button"
                expand="block"
                color="primary"
                onClick={this.props.submit}
              >
                Sign In
              </IonButton>
              <IonGrid className="container">
                <IonRow>
                  <IonGrid className="item">
                    <IonRouterLink href="/reset" color="secondary">
                      Forgot password?
                    </IonRouterLink>
                  </IonGrid>
                  <IonGrid className="item">
                    <IonRouterLink href="/register" color="secondary">
                      {"Don't have an account? Sign Up"}
                    </IonRouterLink>
                  </IonGrid>
                </IonRow>
              </IonGrid>
            </form>
          </CreateAnimation>
        </div>
      </IonContent>
    );
  }
}

export default Login;
