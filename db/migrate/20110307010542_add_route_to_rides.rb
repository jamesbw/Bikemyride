class AddRouteToRides < ActiveRecord::Migration
  def self.up
    add_column :rides, :route, :text
  end

  def self.down
    remove_column :rides, :route
  end
end
