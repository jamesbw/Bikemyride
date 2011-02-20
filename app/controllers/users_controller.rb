class UsersController < ApplicationController
  before_filter :authenticate, :except => [:new, :show, :create]
  before_filter :correct_user, :only => [:edit, :update]
  before_filter :admin_user, :only => :destroy
  before_filter :not_signed_in, :only => [ :create, :new ]


  def new
  	@user = User.new
  	@title = "Sign up"
  end

  def show
  	@user = User.find(params[:id])
  	@title = @user.name
    @rides = @user.rides.paginate(:page => params[:page])
  end

  def create

  	@user = User.new(params[:user])
  	if @user.save
  		sign_in @user
  		flash[:success]= "Welcome to Bike My Ride"
			redirect_to @user
		else
			@title = "Sign up"
			render :new
		end
	end

  def edit
    @title = "Edit user"
  end

  def update
    @user = User.find(params[:id])

    if @user.update_attributes(params[:user])
      flash[:success] = "Profile updated."
      redirect_to @user
    else
      @title = "Edit user"
      render :edit
    end
  end

  def index
    @title = "All users"
    @users = User.paginate( :page => params[:page] )
  end

  def destroy
    user = User.find(params[:id])
    if user == current_user
      flash[:error] = "Can't delete yourself!"
    else
      user.destroy
      flash[:success] = "User detroyed."
    end
    redirect_to users_path
  end


  private




    def correct_user
      @user = User.find(params[:id])
      redirect_to(root_path) unless current_user?(@user)
    end

    def admin_user
      redirect_to(root_path) unless current_user.admin?
    end

    def not_signed_in
      redirect_to(root_path) if current_user
    end
end
