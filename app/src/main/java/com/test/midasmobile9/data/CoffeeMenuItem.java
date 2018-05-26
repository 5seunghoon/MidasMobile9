package com.test.midasmobile9.data;

import android.os.Parcel;
import android.os.Parcelable;

import com.google.gson.annotations.SerializedName;

public class CoffeeMenuItem implements Parcelable{

    @SerializedName("no")
    private int no;
    @SerializedName("name")
    private String name;
    @SerializedName("info")
    private String info;
    @SerializedName("price")
    private String price;
    @SerializedName("img")
    private String img;
    @SerializedName("hotcold")
    private String hotcold;
    @SerializedName("enable")
    private String enable;

    protected CoffeeMenuItem(Parcel in) {
        no = in.readInt();
        name = in.readString();
        info = in.readString();
        price = in.readString();
        img = in.readString();
        hotcold = in.readString();
        enable = in.readString();
    }

    public static final Creator<CoffeeMenuItem> CREATOR = new Creator<CoffeeMenuItem>() {
        @Override
        public CoffeeMenuItem createFromParcel(Parcel in) {
            return new CoffeeMenuItem(in);
        }

        @Override
        public CoffeeMenuItem[] newArray(int size) {
            return new CoffeeMenuItem[size];
        }
    };

    @Override
    public int describeContents() {
        return 0;
    }

    @Override
    public void writeToParcel(Parcel dest, int flags) {
        dest.writeInt(no);
        dest.writeString(name);
        dest.writeString(info);
        dest.writeString(price);
        dest.writeString(img);
        dest.writeString(hotcold);
        dest.writeString(enable);
    }

    public int getNo() {
        return no;
    }

    public void setNo(int no) {
        this.no = no;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getInfo() {
        return info;
    }

    public void setInfo(String info) {
        this.info = info;
    }

    public String getPrice() {
        return price;
    }

    public void setPrice(String price) {
        this.price = price;
    }

    public String getImg() {
        return img;
    }

    public void setImg(String img) {
        this.img = img;
    }

    public String getHotcold() {
        return hotcold;
    }

    public void setHotcold(String hotcold) {
        this.hotcold = hotcold;
    }

    public String getEnable() {
        return enable;
    }

    public void setEnable(String enable) {
        this.enable = enable;
    }
}