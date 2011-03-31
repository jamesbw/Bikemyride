class RidesController < ApplicationController
	before_filter :authenticate, :only => [ :create, :destroy]

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

  def show_summary
    @ride = Ride.find(params[:id])
    respond_to do |format| 
      format.js { render 'rides/ride_summary' }
    end
  end

end