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
          fill_in :ride_title, :with =>""
          fill_in :ride_max_grade, :with =>""
          click_button
          response.should render_template('pages/home')
          response.should have_selector("div#error_explanation")
        end.should_not change(Ride, :count)
      end
    end

    describe "success" do

      it "should make a new ride" do
        content = "Lorem ipsum dolor sit amet"
        title = "This is a title"
        max_grade = "5"
        total_distance = "50.1"
        total_climb = "2500"
        elevations = "json array of ints"
        lambda do
          visit root_path
          fill_in :ride_route, :with => content
          fill_in :ride_title, :with => title
          fill_in :ride_max_grade, :with => max_grade
          fill_in :ride_total_distance, :with => total_distance
          fill_in :ride_total_climb, :with => total_climb
          fill_in :ride_elevations, :with => elevations
          click_button
          response.should have_selector("div.success")
        end.should change(Ride, :count).by(1)
      end
    end
  end
end

