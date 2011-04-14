class AddMaxGradeToRides < ActiveRecord::Migration
  def self.up
    add_column :rides, :max_grade, :integer
  end

  def self.down
    remove_column :rides, :max_grade
  end
end
