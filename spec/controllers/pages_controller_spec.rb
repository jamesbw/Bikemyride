require 'spec_helper'

describe PagesController do
  render_views

  before(:each) do
    @base_title = "Bike My Ride"
  end

  describe "GET 'home'" do
    it "should be successful" do
      get 'home'
      response.should be_success
    end

    it "should have the right title" do
      get :home
      response.should have_selector("title", :content => "#{@base_title} | Home")
    end

    it "should not have a Rails Tutorial link" do
      get :home
      response.should_not have_selector("a", :content => "Rails Tutorial")
    end

    it "should have all footer links" do
      get :home
      footer_links = %w[About News Contact]
      footer_links.each do |link|
        response.should have_selector("a", :content => link)
      end
    end
  end

  describe "GET 'contact'" do
    it "should be successful" do
      get 'contact'
      response.should be_success
    end

      it "should have the right title" do
      get 'contact'
      response.should have_selector("title",
                                    :content => @base_title + " | Contact")
    end
  end

  describe "GET 'about'" do
    it "should be successful" do
      get 'about'
      response.should be_success
    end

    it "should have the right title" do
      get 'about'
      response.should have_selector("title",
                                    :content => @base_title + " | About")
    end
  end

  describe "GET 'news'" do
    it "should be successful" do
      get :news 
      response.should be_success
    end

    it "should have the right title" do
      get :news
      response.should have_selector("title",
                                    :content => @base_title + " | News")
    end    
  end

end
