module ApplicationHelper


  def logo
    image_tag("bike_header.jpg", :alt => "Bike My Ride", :class => "round", :id => "banner")
  end


  # Return a title on a per-page basis.
  def title
    base_title = "Bike My Ride"
    if @title.nil?
      base_title
    else
      "#{base_title} | #{@title}"
    end
  end
end

