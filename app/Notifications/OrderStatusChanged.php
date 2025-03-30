<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class OrderStatusChanged extends Notification implements ShouldQueue
{
    use Queueable;

    protected $order;
    protected $newStatus;

    public function __construct($order, $newStatus)
    {
        $this->order = $order;
        $this->newStatus = $newStatus;
    }

    public function via($notifiable)
    {
        return ['database']; // Store in database; add 'mail' for email
    }

    public function toArray($notifiable)
    {
        return [
            'order_id' => $this->order->id,
            'product_id' => $this->order->product_id,
            'new_status' => $this->newStatus,
            'message' => "Your order #{$this->order->id} status changed to {$this->newStatus}.",
            'created_at' => now()->toDateTimeString(),
        ];
    }

    // Optional: Add email notification
    public function toMail($notifiable)
    {
        return (new MailMessage)
                    ->line("Your order #{$this->order->id} status has changed to {$this->newStatus}.")
                    ->action('View Order', url('/orders/' . $this->order->id))
                    ->line('Thank you for shopping with us!');
    }
}