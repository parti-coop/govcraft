class OrdersController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:read]
  def read
    order = Order.where(comment_id: params[:Metadata][:comment_id])

    if params[:Metadata][:agent_id].present?
      order = order.find_by(agent_id: params[:Metadata][:agent_id])
    else
      order = order.find_by(agent_id: Agent.where(email: params[:Recipient]))
    end

    order.touch :read_at
    return if order.blank?
  end

  def beacon
    order = Order.find_by(id: params[:id], read_at: nil)
    order.touch(:read_at) if order.present?

    send_file 'public/beacon.png', type: 'image/png'
  end
end
