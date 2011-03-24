require 'spec_helper'

describe "Rides" do

  before(:each) do
    user = Factory(:user)
    visit signin_path
    fill_in :email,    :with => user.email
    fill_in :password, :with => user.password
    click_button
  end
  
  describe "creation" do
    
    describe "failure" do
    
      it "should not make a new ride" do
        lambda do
          visit root_path
          fill_in :ride_route, :with => ""
          click_button
          response.should render_template('pages/home')
          response.should have_selector("div#error_explanation")
        end.should_not change(Ride, :count)
      end
    end

    describe "success" do

      it "should make a new ride" do
        content = "Lorem ipsum dolor sit amet"
        lambda do
          visit root_path
          fill_in :ride_route, :with => content
          click_button
          response.should have_selector("div.success")
        end.should change(Ride, :count).by(1)
      end
    end
  end
end

