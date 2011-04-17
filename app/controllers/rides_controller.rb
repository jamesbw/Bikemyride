include ActionView::Helpers::TextHelper

class RidesController < ApplicationController
	before_filter :authenticate, :only => [ :create, :destroy]
  before_filter :correct_user, :only => [:edit, :update, :destroy]

	def create
    @ride  = current_user.rides.build(params[:ride])
    if @ride.save
      flash[:success] = "Ride created!"
      redirect_to root_path
    else
      render 'pages/home'
    end		
	end

	def destroy
	end

  def edit
    @ride = Ride.find(params[:id])
    @title = "Edit ride: #{@ride.title}"
  end

  def update
    @ride = Ride.find(params[:id])

    if @ride.update_attributes(params[:ride])
      flash[:success] = "Ride updated."
      redirect_to current_user
    else
      @title = "Edit ride: #{@ride.title}"
      render :edit
    end
  end

  def show
    @ride = Ride.find(params[:id])
  end


  # show_summary renders a summary view of the ride in the profile page. This view is loaded only when the ride header is clicked on
  def show_summary
    @ride = Ride.find(params[:id])
    @user = @ride.user
    respond_to do |format| 
      format.js { render 'rides/ride_summary' }
    end
  end

  def delete_multiple
    if(params[:ride_ids]) 

      #make sure the rides all belong to the current user
      params[:ride_ids].each do |ride_id|
        @user = Ride.find(ride_id).user
        redirect_to(root_path) unless current_user?(@user)
      end

      Ride.destroy(params[:ride_ids])
      flash.now[:notice] = "#{pluralize(params[:ride_ids].length,'ride')} successfully deleted"
    
      respond_to do |format|
        format.js
      end 
    end
  end

  private

    def correct_user
      @user = Ride.find(params[:id]).user
      redirect_to(root_path) unless current_user?(@user)
    end



end