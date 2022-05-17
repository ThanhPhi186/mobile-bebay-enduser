package com.natcash;
import expo.modules.ReactActivityDelegateWrapper;
import com.facebook.react.ReactActivityDelegate;
// import com.facebook.react.ReactActivityDelegate; // <- add this necessary import
// import com.zoontek.rnbootsplash.RNBootSplash;
import com.facebook.react.ReactActivity;
import android.os.Bundle;
import org.devio.rn.splashscreen.SplashScreen;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
   @Override
protected void onCreate(Bundle savedInstanceState) {
  SplashScreen.show(this);  
  super.onCreate(null);
}
  @Override
  protected String getMainComponentName() {
    return "natcash";
  }

   @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new ReactActivityDelegate(this, getMainComponentName()) {

      @Override
      protected void loadApp(String appKey) {
        super.loadApp(appKey);
      }
    };
  }
}
