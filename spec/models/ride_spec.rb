require 'spec_helper'

describe Ride do
  before(:each) do
    @user = Factory(:user)
    #should have route validation
    #should have json array
    @attr = { :route => "value for route", :title => "valid title", :max_grade => 5, :total_distance => 50.1, :total_climb => 2000, :elevations => "json array"}
  end

  it "should create a new instance given valid attributes" do
    @user.rides.create!(@attr)
  end

  describe "user associations" do

    before(:each) do
      @ride = @user.rides.create(@attr)
    end

    it "should have a user attribute" do
      @ride.should respond_to(:user)
    end

    it "should have the right associated user" do
      @ride.user_id.should == @user.id
      @ride.user.should == @user
    end

  describe "validations" do

    it "should require a user id" do
      Ride.new(@attr).should_not be_valid
    end

    it "should require nonblank route" do
      @user.rides.build(@attr.merge(:route => "  ")).should_not be_valid
    end

    it "should require positive total climb" do
      @user.rides.build(@attr.merge(:total_climb => -1)).should_not be_valid
    end

    it "should require nonblank elevations" do
      @user.rides.build(@attr.merge(:elevations => "  ")).should_not be_valid
    end

    it "should require positive total distance " do
      @user.rides.build(@attr.merge(:total_distance => -1)).should_not be_valid
    end

    it "should require positive max grade " do
      @user.rides.build(@attr.merge(:max_grade => -1)).should_not be_valid
    end

    it "should reject max grades above 100 " do
      @user.rides.build(@attr.merge(:max_grade => 101)).should_not be_valid
    end

    it "should reject long titles" do
      @user.rides.build(@attr.merge(:title => "a" * 141)).should_not be_valid
    end

    it "should require non blank title" do
      @user.rides.build(@attr.merge(:title => "  ")).should_not be_valid
    end


  end


  end
end
