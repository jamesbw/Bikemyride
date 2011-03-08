require 'spec_helper'

describe Ride do
  before(:each) do
    @user = Factory(:user)
    #should have route validation
    @attr = { :route => "value for route" }
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

    it "should require nonblank content" do
      @user.rides.build(:route => "  ").should_not be_valid
    end

  end


  end
end
