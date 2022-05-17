package com.natcash;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.Signature;
import android.util.Base64;
import android.util.Log;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Map;
import java.util.HashMap;

public class KeysModule extends ReactContextBaseJavaModule {
    private static KeysModule instance = null;
    private ReactContext mReactContext;
    private DeviceEventManagerModule.RCTDeviceEventEmitter mJSModule = null;
   KeysModule(ReactApplicationContext reactContext) {
       super(reactContext);
       mReactContext = reactContext;
   }
   public static KeysModule initKeysModule(ReactApplicationContext reactContext) {
    instance = new KeysModule(reactContext);
    return instance;
  }
  @ReactMethod
  public void getKeyHash(String hashStretagy, Promise promise) {
      try {
          final PackageInfo info = mReactContext.getPackageManager()
                  .getPackageInfo(BuildConfig.APPLICATION_ID, PackageManager.GET_SIGNATURES);

          for (Signature signature : info.signatures) {
              final MessageDigest md = MessageDigest.getInstance(hashStretagy);
              md.update(signature.toByteArray());

              final byte[] digest = md.digest();
              final StringBuilder toRet = new StringBuilder();
              for (int i = 0; i < digest.length; i++) {
                  if (i != 0) toRet.append(":");
                  int b = digest[i] & 0xff;
                  String hex = Integer.toHexString(b);
                  if (hex.length() == 1) toRet.append("0");
                  toRet.append(hex);
              }

              Log.e("FINAL KEY", hashStretagy + " " + toRet.toString());
              promise.resolve(toRet.toString());
          }
      } catch (PackageManager.NameNotFoundException e1) {
          Log.e("name not found", e1.toString());
      } catch (NoSuchAlgorithmException e) {
          Log.e("no such an algorithm", e.toString());
      } catch (Exception e) {
          Log.e("exception", e.toString());
      }

  }
    @Override
    public String getName() {
        return "Keys";
    }
}